
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

interface TestCase {
  id: number;
  input: string;
  expected: string;
  status: 'idle' | 'running' | 'success' | 'error';
}

const TestCases: React.FC = () => {
  // Mock test cases
  const testCases: TestCase[] = [
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
  ];

  return (
    <div className="space-y-3">
      {testCases.map((testCase) => (
        <div 
          key={testCase.id}
          className="border rounded-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-2 bg-muted">
            <span className="text-sm font-medium">Test Case {testCase.id}</span>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <PlayCircle className="h-4 w-4 mr-1" />
              Run
            </Button>
          </div>
          <div className="p-3 text-sm">
            <div className="mb-2">
              <span className="text-muted-foreground">Input: </span>
              <span className="font-mono">{testCase.input}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Expected: </span>
              <span className="font-mono">{testCase.expected}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCases;
