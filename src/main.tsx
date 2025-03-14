
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
        description: "Implement an algorithm to find occurrences of a pattern in a DNA sequence. This is a fundamental operation in bioinformatics used for identifying genetic markers, locating genes, and analyzing regulatory elements. Your algorithm should return all starting positions where the pattern occurs in the DNA sequence.\n\nIn bioinformatics, efficient pattern matching is crucial for analyzing genomic data. Standard string matching algorithms like the naive approach, KMP (Knuth-Morris-Pratt), or Boyer-Moore can be adapted for DNA sequences. Consider the specific characteristics of DNA sequences (limited alphabet of A, C, G, T) when designing your solution.",
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
        description: "Implement the Needleman-Wunsch algorithm for global alignment of two DNA sequences. This algorithm is essential in bioinformatics for comparing biological sequences and inferring evolutionary relationships.\n\nThe Needleman-Wunsch algorithm uses dynamic programming to find the optimal alignment between two sequences. It builds a scoring matrix by comparing each character of one sequence with each character of the other, considering matches, mismatches, and gaps. The algorithm assigns scores for matches, penalties for mismatches, and gap penalties, then backtracks through the matrix to find the optimal alignment.\n\nYour implementation should return both the optimal alignment score and the aligned sequences with gaps inserted where needed to maximize similarity.",
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
      },
      {
        id: 3,
        title: "RNA Secondary Structure Prediction",
        difficulty: "hard",
        category: "dynamic-programming",
        slug: "rna-structure-prediction",
        description: "Implement the Nussinov algorithm for predicting RNA secondary structure. RNA molecules fold back on themselves to form base pairs, creating complex three-dimensional structures essential for their function.\n\nThe Nussinov algorithm uses dynamic programming to find the maximum number of base pairs that can form in an RNA sequence. It considers the complementary base pairs (A-U, G-C) and builds a table to track the optimal structure.\n\nYour implementation should return both the maximum number of base pairs and a representation of the predicted structure using dot-bracket notation, where dots represent unpaired nucleotides and parentheses represent paired nucleotides.",
        examples: [
          { 
            input: "RNA Sequence: GGGAAAUCC", 
            output: "Max base pairs: 3\nStructure: (((...)))",
            explanation: "The G's at positions 0,1,2 pair with C's at positions 6,7,8, while A's remain unpaired."
          }
        ],
        constraints: [
          "The RNA sequence contains only characters A, C, G, and U",
          "The length of the sequence is between 1 and 1000",
          "Valid base pairs are A-U and G-C",
          "Each base can pair with at most one other base",
          "Crossing base pairs are not allowed"
        ],
        starterCode: {
          javascript: `function predictRNAStructure(rnaSequence) {
  // Your implementation here
  // Return the maximum number of base pairs and the structure in dot-bracket notation
}

// Example usage:
// const result = predictRNAStructure("GGGAAAUCC");
// console.log(result); // Should output { maxPairs: 3, structure: "(((...)))" }`
        }
      },
      {
        id: 4,
        title: "Phylogenetic Tree Construction",
        difficulty: "medium",
        category: "graph-algorithms",
        slug: "phylogenetic-tree",
        description: "Implement the UPGMA (Unweighted Pair Group Method with Arithmetic Mean) algorithm for constructing a phylogenetic tree from a distance matrix. Phylogenetic trees represent evolutionary relationships between biological sequences or organisms.\n\nThe UPGMA algorithm is a hierarchical clustering method that assumes a constant rate of evolution. It starts with each sequence as its own cluster and iteratively joins the closest clusters until a single tree is formed.\n\nYour implementation should take a distance matrix as input and return a representation of the phylogenetic tree, including branch lengths that represent evolutionary time.",
        examples: [
          { 
            input: "Distance Matrix:\n0 5 9 9\n5 0 10 10\n9 10 0 8\n9 10 8 0", 
            output: "Newick format: ((A:2.5,B:2.5):2.0,(C:4.0,D:4.0):0.5);",
            explanation: "The tree groups A with B and C with D, with branch lengths proportional to evolutionary distance."
          }
        ],
        constraints: [
          "The distance matrix is symmetric and has zeros on the diagonal",
          "The number of sequences is between 2 and 100",
          "All distances are non-negative"
        ],
        starterCode: {
          javascript: `function constructPhylogeneticTree(distanceMatrix) {
  // Your implementation here
  // Return the phylogenetic tree in Newick format
}

// Example usage:
// const distanceMatrix = [
//   [0, 5, 9, 9],
//   [5, 0, 10, 10],
//   [9, 10, 0, 8],
//   [9, 10, 8, 0]
// ];
// const result = constructPhylogeneticTree(distanceMatrix);
// console.log(result);`
        }
      },
      {
        id: 5,
        title: "Protein Structure Prediction",
        difficulty: "hard",
        category: "machine-learning",
        slug: "protein-structure",
        description: "Implement a simplified version of the HP (Hydrophobic-Polar) model for predicting protein folding in 2D space. Protein folding is a fundamental process in molecular biology that determines the 3D structure and function of proteins.\n\nThe HP model simplifies amino acids into just two types: hydrophobic (H) and polar (P). In this model, a protein folds to maximize the number of H-H contacts (hydrophobic interactions) while maintaining a valid self-avoiding walk on a 2D lattice.\n\nYour implementation should take a sequence of H and P residues and return the maximum number of H-H contacts possible and a 2D representation of the folded structure.",
        examples: [
          { 
            input: "HP Sequence: HPHPPHHPHPPHPHHPPHPH", 
            output: "Maximum H-H contacts: 9\nStructure: (0,0),(1,0),(1,1),(2,1),(2,2),(1,2),(0,2),(0,3),(-1,3),(-1,2),(-1,1),(-2,1),(-2,0),(-1,0),(-1,-1),(0,-1),(1,-1),(2,-1),(3,-1),(3,0)",
            explanation: "The protein folds to form 9 H-H contacts while avoiding self-intersection on a 2D grid."
          }
        ],
        constraints: [
          "The sequence contains only characters H and P",
          "The length of the sequence is between 1 and 100",
          "The protein chain cannot intersect itself",
          "Each residue must be adjacent to its neighbors in the sequence"
        ],
        starterCode: {
          javascript: `function predictProteinStructure(hpSequence) {
  // Your implementation here
  // Return the maximum number of H-H contacts and the 2D coordinates of the folded structure
}

// Example usage:
// const result = predictProteinStructure("HPHPPHHPHPPHPHHPPHPH");
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
