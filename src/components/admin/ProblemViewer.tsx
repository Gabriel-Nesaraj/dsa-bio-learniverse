
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash, Code } from 'lucide-react';
import { toast } from "sonner";
import CodeEditor from '@/components/problems/CodeEditor';
import mongoService from '@/services/mongoService';

type Difficulty = 'easy' | 'medium' | 'hard';

type Problem = {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  examples: { 
    input: string; 
    output: string; 
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<string, string>;
};

type Submission = {
  id: string;
  userId: string;
  problemId: number;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error';
  timestamp: number;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
};

interface ProblemViewerProps {
  problem: Problem;
  onBack: () => void;
  onEdit: (id: number) => void;
}

const ProblemViewer: React.FC<ProblemViewerProps> = ({ problem, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!problem) {
    console.error("Problem is undefined in ProblemViewer");
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problems
        </Button>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Problem not found or failed to load.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load submissions
        const allSubmissions = await mongoService.getSubmissions();
        const problemSubmissions = allSubmissions.filter((s: Submission) => s.problemId === problem.id);
        setSubmissions(problemSubmissions);
        
        // Load users
        const allUsers = await mongoService.getUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [problem.id]);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        await mongoService.deleteProblem(problem.id);
        toast.success("Problem deleted successfully!");
        onBack();
      } catch (error) {
        console.error("Error deleting problem:", error);
        toast.error("Failed to delete problem");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Find the user for a specific submission
  const findUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problems
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(problem.id)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Problem
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash className="w-4 h-4 mr-2" />
            Delete Problem
          </Button>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
        <div className="flex items-center gap-4 text-sm mb-6">
          <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-muted-foreground">
            {problem.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-muted-foreground">
            ID: {problem.id}
          </span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="solutions">
            Solutions ({submissions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{problem.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {problem.examples && problem.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium">Example {index + 1}:</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-mono text-sm whitespace-pre-line">
                        <span className="text-muted-foreground">Input: </span>{example.input}
                      </p>
                      <p className="font-mono text-sm whitespace-pre-line mt-2">
                        <span className="text-muted-foreground">Output: </span>{example.output}
                      </p>
                      {example.explanation && (
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">Explanation: </span>{example.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {problem.constraints && problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{constraint}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Starter Code (JavaScript)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                {problem.starterCode && problem.starterCode.javascript 
                  ? problem.starterCode.javascript 
                  : 'No starter code available'}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="solutions" className="space-y-6 pt-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : submissions.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No solutions submitted for this problem yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        {findUserName(submission.userId)}
                      </CardTitle>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        submission.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {submission.status.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(submission.timestamp).toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CodeEditor 
                      language={submission.language}
                      code={submission.code}
                      readOnly={true}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemViewer;
