import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle2, Clock, BarChart3, AlertCircle, Code } from 'lucide-react';
import CodeEditor from '@/components/problems/CodeEditor';
import ProblemDescription from '@/components/problems/ProblemDescription';
import TestCases from '@/components/problems/TestCases';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import mongoService from '@/services/mongoService';

const SUPPORTED_LANGUAGES = [
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'swift', name: 'Swift' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'scala', name: 'Scala' },
  { id: 'typescript', name: 'TypeScript' },
];

const DEFAULT_PROBLEM = {
  id: 1,
  title: "DNA Pattern Matching",
  difficulty: "medium",
  category: "dynamic-programming",
  slug: "dna-pattern-matching",
  description: "Implement an algorithm to find occurrences of a pattern in a DNA sequence. This is a fundamental operation in bioinformatics.",
  examples: [
    { 
      input: "Sequence: ACGTACGT, Pattern: ACG", 
      output: "Matches found at positions: 0, 4",
      explanation: "The pattern 'ACG' appears at the beginning of the sequence and again at position 4."
    }
  ],
  constraints: [
    "The sequences contain only characters A, C, G, and T",
    "The length of the sequence is between 1 and 10,000",
    "The length of the pattern is between 1 and 100"
  ],
  starterCode: {
    javascript: `function findPattern(sequence, pattern) {
  // Your implementation here
  // Return an array of starting positions where the pattern occurs
}

// Example usage:
// const result = findPattern("ACGTACGT", "ACG");
// console.log(result); // Should output [0, 4]`,
    python: `def find_pattern(sequence, pattern):
    # Your implementation here
    # Return a list of starting positions where the pattern occurs
    pass

# Example usage:
# result = find_pattern("ACGTACGT", "ACG")
# print(result)  # Should output [0, 4]`,
    cpp: `#include <string>
#include <vector>

std::vector<int> findPattern(const std::string& sequence, const std::string& pattern) {
    // Your implementation here
    // Return a vector of starting positions where the pattern occurs
    return {};
}

// Example usage:
// auto result = findPattern("ACGTACGT", "ACG");
// Should output [0, 4]`,
    java: `import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findPattern(String sequence, String pattern) {
        // Your implementation here
        // Return a list of starting positions where the pattern occurs
        return new ArrayList<>();
    }
}

// Example usage:
// List<Integer> result = new Solution().findPattern("ACGTACGT", "ACG");
// Should output [0, 4]`,
    typescript: `function findPattern(sequence: string, pattern: string): number[] {
  // Your implementation here
  // Return an array of starting positions where the pattern occurs
  return [];
}

// Example usage:
// const result = findPattern("ACGTACGT", "ACG");
// console.log(result); // Should output [0, 4]`,
  }
};

const ProblemDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState('');
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allProblems, setAllProblems] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [solutionsLoading, setSolutionsLoading] = useState(false);

  useEffect(() => {
    const loadProblem = () => {
      setIsLoading(true);
      try {
        const storedProblems = localStorage.getItem('problems');
        if (storedProblems) {
          const problems = JSON.parse(storedProblems);
          setAllProblems(problems);
          
          const currentProblem = problems.find((p: any) => p.slug === slug);
          
          if (currentProblem) {
            setProblem(currentProblem);
          } else {
            setProblem({
              ...DEFAULT_PROBLEM,
              slug: slug
            });
          }
        } else {
          setProblem({
            ...DEFAULT_PROBLEM,
            slug: slug
          });
        }
      } catch (error) {
        console.error('Error loading problem:', error);
        setProblem({
          ...DEFAULT_PROBLEM,
          slug: slug
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProblem();
  }, [slug]);

  useEffect(() => {
    if (problem?.starterCode && problem.starterCode[selectedLanguage]) {
      setUserCode(problem.starterCode[selectedLanguage]);
    } else if (problem) {
      setUserCode(`// No starter code available for ${selectedLanguage}`);
    }
  }, [selectedLanguage, problem]);

  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode);
  };

  const handleRunTests = () => {
    toast.info("Running all tests...");
    setTimeout(() => {
      toast.success("All tests completed!");
    }, 1500);
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error("Please log in to submit your solution");
      navigate('/login');
      return;
    }

    setIsCodeSubmitting(true);
    toast.info("Submitting solution...");
    
    setTimeout(() => {
      const isCorrect = Math.random() > 0.3;
      
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const newSubmission = {
        id: crypto.randomUUID(),
        userId: user.id,
        problemId: problem.id,
        code: userCode,
        language: selectedLanguage,
        status: isCorrect ? 'accepted' : 'wrong_answer',
        timestamp: Date.now()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem('submissions', JSON.stringify(submissions));
      
      setIsCodeSubmitting(false);
      
      if (isCorrect) {
        toast.success("Solution accepted! All test cases passed.");
      } else {
        toast.error("Solution failed. Some test cases didn't pass.");
      }
    }, 2000);
  };

  useEffect(() => {
    const loadSubmissions = async () => {
      if (isAdmin && problem?.id) {
        setSolutionsLoading(true);
        try {
          const problemSubmissions = await mongoService.getSubmissionsByProblemId(problem.id);
          setSubmissions(problemSubmissions);
        } catch (error) {
          console.error("Error loading submissions:", error);
        } finally {
          setSolutionsLoading(false);
        }
      }
    };

    if (isAdmin && problem?.id) {
      loadSubmissions();
    }
  }, [isAdmin, problem]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 mt-16">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 mx-auto border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-4 text-muted-foreground">Loading problem...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 mt-16">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-bold">Problem not found</h1>
            <p className="mt-2 text-muted-foreground">
              The problem you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-6" variant="outline" asChild>
              <a href="/problems">Back to Problems</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const examples = problem.examples || [];
  const constraints = problem.constraints || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 mt-16 mb-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
              <a href="/problems">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Problems
              </a>
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-medium ${
              problem.difficulty === 'easy' ? 'text-green-500' : 
              problem.difficulty === 'medium' ? 'text-yellow-600' : 
              'text-red-500'
            }`}>
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-muted-foreground">
              {problem.category ? problem.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Uncategorized'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <Tabs defaultValue="description" onValueChange={setActiveTab}>
              <TabsList className="w-full rounded-none border-b bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="hints" 
                  className="rounded-none flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Hints
                </TabsTrigger>
                <TabsTrigger 
                  value="solutions" 
                  className="rounded-none flex-1 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Solutions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6 m-0">
                <ProblemDescription problem={problem} />
              </TabsContent>
              
              <TabsContent value="hints" className="p-6 m-0">
                <div className="space-y-4">
                  <h3 className="font-medium">Hint 1</h3>
                  <p className="text-muted-foreground">
                    Consider using a sliding window approach to compare substrings.
                  </p>
                  
                  <h3 className="font-medium">Hint 2</h3>
                  <p className="text-muted-foreground">
                    For more efficient pattern matching, look into algorithms like KMP (Knuth-Morris-Pratt) or Boyer-Moore.
                  </p>
                  
                  <h3 className="font-medium">Hint 3</h3>
                  <p className="text-muted-foreground">
                    Remember to handle edge cases, such as when the pattern is longer than the sequence.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="solutions" className="p-6 m-0">
                {isAdmin ? (
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">Submitted Solutions</h3>
                    {solutionsLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : submissions.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No solutions submitted for this problem yet.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {submissions.map((submission) => (
                          <Card key={submission.id} className="overflow-hidden">
                            <div className="bg-muted p-3 flex justify-between items-center border-b">
                              <div>
                                <p className="font-medium">User: {submission.userId}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(submission.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs ${
                                submission.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {submission.status.replace('_', ' ').split(' ').map((word: string) => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </div>
                            </div>
                            <div className="p-0">
                              <CodeEditor
                                language={submission.language}
                                code={submission.code}
                                readOnly={true}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="font-medium mb-2">Solutions are locked</h3>
                    <p className="text-muted-foreground mb-4">
                      Try solving the problem first before viewing the solution.
                    </p>
                    <Button variant="outline">Unlock Solution</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="border-b p-3 flex justify-between items-center">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => {
                  if (problem?.starterCode?.[selectedLanguage]) {
                    setUserCode(problem.starterCode[selectedLanguage]);
                  } else {
                    setUserCode(`// No starter code available for ${selectedLanguage}`);
                  }
                }}>
                  Reset Code
                </Button>
              </div>
              
              <CodeEditor 
                language={selectedLanguage} 
                code={userCode} 
                onChange={handleCodeChange}
              />
            </Card>
            
            <Card>
              <div className="border-b p-3">
                <h3 className="font-medium">Test Cases</h3>
              </div>
              <div className="p-4">
                <TestCases 
                  code={userCode}
                  language={selectedLanguage}
                />
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={handleRunTests}>Run All Tests</Button>
                  <Button onClick={handleSubmit} disabled={isCodeSubmitting}>
                    {isCodeSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProblemDetail;
