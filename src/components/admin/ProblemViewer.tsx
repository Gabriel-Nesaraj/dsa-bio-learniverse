
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { toast } from "sonner";

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

interface ProblemViewerProps {
  problem: Problem;
  onBack: () => void;
  onEdit: (id: number) => void;
}

const ProblemViewer: React.FC<ProblemViewerProps> = ({ problem, onBack, onEdit }) => {
  // Add null check for problem
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

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      const storedProblems = localStorage.getItem('problems');
      if (storedProblems) {
        const problems = JSON.parse(storedProblems);
        const updatedProblems = problems.filter((p: Problem) => p.id !== problem.id);
        localStorage.setItem('problems', JSON.stringify(updatedProblems));
        
        toast.success("Problem deleted successfully!");
        onBack();
      }
    }
  };
  
  // Using console.log to debug
  console.log("ProblemViewer rendering with problem:", problem);
  
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
          <Button variant="destructive" onClick={handleDelete}>
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
    </div>
  );
};

export default ProblemViewer;
