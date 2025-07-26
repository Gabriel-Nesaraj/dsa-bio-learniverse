
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import DNAAnimation from './DNAAnimation';
import ProteinAnimation from './ProteinAnimation';

interface TestCase {
  id: number;
  input: string;
  expected: string;
  status: 'idle' | 'running' | 'success' | 'error';
  result?: string;
}

interface TestCasesProps {
  code: string;
  language: string;
  problemData?: {
    testCases?: {
      id: number;
      input: string;
      expected: string;
    }[];
    category?: string;
    title?: string;
  };
}

const TestCases: React.FC<TestCasesProps> = ({ code, language, problemData }) => {
  // State to track test cases
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  // Initialize test cases from problem data or use defaults
  useEffect(() => {
    if (problemData?.testCases && problemData.testCases.length > 0) {
      setTestCases(
        problemData.testCases.map(tc => ({
          ...tc,
          status: 'idle'
        }))
      );
    } else {
      // Default test cases if none provided
      setTestCases([
        {
          id: 1,
          input: 'seq1: "ACGTACGT", seq2: "ACGTCT"',
          expected: 'Score: 3, Aligned sequences shown in description',
          status: 'idle'
        },
        {
          id: 2,
          input: 'seq1: "ATTGCC", seq2: "ATGGCT"',
          expected: 'Score: 1, Appropriate alignment',
          status: 'idle'
        }
      ]);
    }
  }, [problemData]);

  // Listen for "run all tests" event
  useEffect(() => {
    const handleRunAllTests = () => {
      setTestCases(prev => prev.map(tc => ({ ...tc, status: 'running' })));
      
      // Simulate running each test case with staggered timing
      testCases.forEach((tc, index) => {
        setTimeout(() => {
          setTestCases(prev => 
            prev.map(testCase => {
              if (testCase.id === tc.id) {
                const success = Math.random() > 0.3;
                return {
                  ...testCase,
                  status: success ? 'success' : 'error',
                  result: success 
                    ? 'Score: ' + (testCase.id === 1 ? '3' : '1') + ', Analysis successful'
                    : 'Error: Incorrect analysis'
                };
              }
              return testCase;
            })
          );
        }, 2000 + index * 500);
      });
    };

    window.addEventListener('runAllTests', handleRunAllTests);
    return () => window.removeEventListener('runAllTests', handleRunAllTests);
  }, [testCases]);

  const getAnimationType = () => {
    const title = problemData?.title?.toLowerCase() || '';
    const category = problemData?.category?.toLowerCase() || '';
    
    if (title.includes('dna') || title.includes('sequence') || title.includes('alignment')) {
      if (title.includes('pattern') || title.includes('matching')) return 'pattern-matching';
      if (title.includes('mutation')) return 'mutation';
      return 'alignment';
    }
    
    if (title.includes('protein') || category.includes('protein')) {
      if (title.includes('folding')) return 'folding';
      if (title.includes('binding')) return 'binding';
      return 'structure';
    }
    
    return 'alignment'; // default
  };

  const isProteinProblem = () => {
    const title = problemData?.title?.toLowerCase() || '';
    const category = problemData?.category?.toLowerCase() || '';
    return title.includes('protein') || category.includes('protein');
  };

  const runTestCase = (id: number) => {
    // Update status to running
    setTestCases(prev => 
      prev.map(tc => 
        tc.id === id ? { ...tc, status: 'running' } : tc
      )
    );

    // Simulate execution (in a real app, this would send code to a backend)
    setTimeout(() => {
      setTestCases(prev => 
        prev.map(tc => {
          if (tc.id === id) {
            // Simulate test result (70% chance of success for better demo)
            const success = Math.random() > 0.3;
            return { 
              ...tc, 
              status: success ? 'success' : 'error',
              result: success 
                ? 'Score: ' + (tc.id === 1 ? '3' : '1') + ', Analysis successful'
                : 'Error: Incorrect analysis'
            };
          }
          return tc;
        })
      );
    }, 2000);
  };

  return (
    <div className="space-y-3">
      {testCases.map((testCase) => (
        <div 
          key={testCase.id}
          className="border rounded-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-2 bg-muted">
            <span className="text-sm font-medium">Test Case {testCase.id}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2"
              onClick={() => runTestCase(testCase.id)}
              disabled={testCase.status === 'running'}
            >
              {testCase.status === 'running' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running
                </span>
              ) : testCase.status === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              ) : testCase.status === 'error' ? (
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              {testCase.status === 'idle' && "Run"}
            </Button>
          </div>
          
          {/* Animation section */}
          {(testCase.status === 'running' || testCase.status === 'success' || testCase.status === 'error') && (
            <div className="p-3 border-b">
              {isProteinProblem() ? (
                <ProteinAnimation
                  isRunning={testCase.status === 'running'}
                  type={getAnimationType() as 'folding' | 'structure' | 'binding'}
                  status={testCase.status}
                />
              ) : (
                <DNAAnimation
                  isRunning={testCase.status === 'running'}
                  type={getAnimationType() as 'alignment' | 'pattern-matching' | 'mutation'}
                  status={testCase.status}
                />
              )}
            </div>
          )}
          
          <div className="p-3 text-sm">
            <div className="mb-2">
              <span className="text-muted-foreground">Input: </span>
              <span className="font-mono">{testCase.input}</span>
            </div>
            <div className="mb-2">
              <span className="text-muted-foreground">Expected: </span>
              <span className="font-mono">{testCase.expected}</span>
            </div>
            {testCase.result && (
              <div className={`font-mono ${testCase.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-muted-foreground">Result: </span>
                <span>{testCase.result}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCases;
