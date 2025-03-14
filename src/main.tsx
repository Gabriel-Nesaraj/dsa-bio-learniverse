
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize problem data if it doesn't exist
const initializeData = () => {
  // Check if problems exist in localStorage
  if (!localStorage.getItem('problems')) {
    const initialProblems = [
      {
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
# print(result)  # Should output [0, 4]`
        }
      },
      {
        id: 2,
        title: "DNA Sequence Alignment",
        difficulty: "hard",
        category: "dynamic-programming",
        slug: "dna-sequence-alignment",
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
// console.log(result);`
        }
      }
    ];
    
    localStorage.setItem('problems', JSON.stringify(initialProblems));
  }
  
  // Initialize empty submissions array if it doesn't exist
  if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify([]));
  }
};

// Initialize data before mounting the app
try {
  initializeData();
} catch (error) {
  console.error("Error initializing data:", error);
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error rendering the app:", error);
    // Provide fallback UI for critical errors
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Something went wrong</h1>
        <p>The application failed to load. Please try refreshing the page.</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px;">${error?.message || 'Unknown error'}</pre>
      </div>
    `;
  }
}
