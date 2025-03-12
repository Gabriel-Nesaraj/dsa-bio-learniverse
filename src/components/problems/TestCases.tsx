
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle, XCircle } from 'lucide-react';

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
}

const TestCases: React.FC<TestCasesProps> = ({ code, language }) => {
  // State to track test cases
  const [testCases, setTestCases] = useState<TestCase[]>([
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
            // Simulate test result (50/50 chance of success)
            const success = Math.random() > 0.5;
            return { 
              ...tc, 
              status: success ? 'success' : 'error',
              result: success 
                ? 'Score: ' + (tc.id === 1 ? '3' : '1') + ', Alignment successful'
                : 'Error: Incorrect alignment'
            };
          }
          return tc;
        })
      );
    }, 1500);
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
