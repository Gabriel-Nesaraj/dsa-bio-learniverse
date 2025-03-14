
import React from 'react';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: {
    [key: string]: string;
  };
}

interface ProblemDescriptionProps {
  problem: Partial<Problem>;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  // Ensure we have arrays to map over, even if they're empty
  const examples = problem.examples || [];
  const constraints = problem.constraints || [];
  
  return (
    <div className="space-y-6">
      <div>
        <p className="whitespace-pre-line">{problem.description || 'No description available.'}</p>
      </div>
      
      {examples.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Examples:</h3>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index} className="space-y-2">
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
        </div>
      )}
      
      {constraints.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Constraints:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {constraints.map((constraint, index) => (
              <li key={index} className="text-sm text-muted-foreground">{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemDescription;
