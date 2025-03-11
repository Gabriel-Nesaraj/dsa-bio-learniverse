
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle2, Clock, BarChart3, AlertCircle } from 'lucide-react';
import CodeEditor from '@/components/problems/CodeEditor';
import ProblemDescription from '@/components/problems/ProblemDescription';
import TestCases from '@/components/problems/TestCases';

const ProblemDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('description');
  
  // This would be fetched from an API in a real app
  const problem = {
    id: 1,
    title: "DNA Sequence Alignment",
    difficulty: "medium",
    category: "dynamic-programming",
    description: "Implement the Needleman-Wunsch algorithm for global alignment of two DNA sequences. This algorithm is used to find the optimal alignment of two sequences that maximizes similarity.",
    examples: [
      { 
        input: "Sequence 1: ACGTACGT, Sequence 2: ACGTCT", 
        output: "Alignment: ACGTACGT\n         ||||  |\nAlignment: ACGT--CT",
        explanation: "The optimal alignment introduces gaps (-) to maximize the number of matching characters."
      }
    ],
    constraints: [
      "The sequences contain only characters A, C, G, and T",
      "The length of each sequence is between 1 and 1000",
      "Match score: +1, Mismatch penalty: -1, Gap penalty: -2"
    ],
    starterCode: {
      javascript: `function needlemanWunsch(seq1, seq2) {
  // Your implementation here
  // Return the optimal alignment score and the aligned sequences
}

// Example usage:
// const result = needlemanWunsch("ACGTACGT", "ACGTCT");
// console.log(result);`,
      python: `def needleman_wunsch(seq1, seq2):
    # Your implementation here
    # Return the optimal alignment score and the aligned sequences
    pass

# Example usage:
# result = needleman_wunsch("ACGTACGT", "ACGTCT")
# print(result)`
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 mt-16 mb-8">
        {/* Problem header */}
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
              {problem.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Problem description */}
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
                    Consider using a 2D matrix to store the alignment scores.
                  </p>
                  
                  <h3 className="font-medium">Hint 2</h3>
                  <p className="text-muted-foreground">
                    Remember to initialize the first row and column with gap penalties.
                  </p>
                  
                  <h3 className="font-medium">Hint 3</h3>
                  <p className="text-muted-foreground">
                    For each cell (i,j), consider three possibilities: match/mismatch, gap in sequence 1, or gap in sequence 2.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="solutions" className="p-6 m-0">
                <div className="text-center py-12">
                  <h3 className="font-medium mb-2">Solutions are locked</h3>
                  <p className="text-muted-foreground mb-4">
                    Try solving the problem first before viewing the solution.
                  </p>
                  <Button variant="outline">Unlock Solution</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Right side - Code editor */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="border-b p-3 flex justify-between items-center">
                <Tabs defaultValue="javascript" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">Reset Code</Button>
              </div>
              
              <CodeEditor 
                language="javascript" 
                code={problem.starterCode.javascript} 
              />
            </Card>
            
            <Card>
              <div className="border-b p-3">
                <h3 className="font-medium">Test Cases</h3>
              </div>
              <div className="p-4">
                <TestCases />
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline">Run Tests</Button>
                  <Button>Submit</Button>
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
