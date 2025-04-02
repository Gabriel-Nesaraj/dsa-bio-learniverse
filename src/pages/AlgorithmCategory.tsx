
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the algorithm details for each category
const algorithmData = {
  "graph": {
    title: "Graph Algorithms",
    description: "Algorithms that operate on graph data structures, crucial for many bioinformatics applications like protein interaction networks and metabolic pathways.",
    algorithms: [
      {
        name: "Breadth-First Search (BFS)",
        description: "Explores all vertices of a graph in breadth-first order, used in pathway analysis and network exploration.",
        complexity: "Time: O(V+E), Space: O(V)"
      },
      {
        name: "Depth-First Search (DFS)",
        description: "Explores as far as possible along each branch before backtracking, used in connected component analysis.",
        complexity: "Time: O(V+E), Space: O(V)"
      },
      {
        name: "Dijkstra's Algorithm",
        description: "Finds the shortest paths from a source vertex to all other vertices, used in biological network analysis.",
        complexity: "Time: O(E + V log V), Space: O(V)"
      },
      {
        name: "Minimum Spanning Tree (MST)",
        description: "Finds a subset of edges that forms a tree including every vertex with minimum weight, used in phylogenetic tree construction.",
        complexity: "Time: O(E log V), Space: O(V+E)"
      }
    ]
  },
  "search": {
    title: "Search Algorithms",
    description: "Algorithms designed to retrieve information stored within data structures, essential for sequence alignment and pattern matching in genomics.",
    algorithms: [
      {
        name: "Binary Search",
        description: "Efficiently finds an item in a sorted list by repeatedly dividing the search space in half.",
        complexity: "Time: O(log n), Space: O(1)"
      },
      {
        name: "Boyer-Moore",
        description: "String searching algorithm that skips sections of the text, widely used for DNA pattern matching.",
        complexity: "Time: O(n+m), Space: O(k) where k is alphabet size"
      },
      {
        name: "Knuth-Morris-Pratt (KMP)",
        description: "String searching algorithm that uses information from previous match attempts, useful for motif finding.",
        complexity: "Time: O(n+m), Space: O(m)"
      },
      {
        name: "Suffix Trees/Arrays",
        description: "Data structures that allow efficient string operations, crucial for genome assembly and comparative genomics.",
        complexity: "Time: O(n), Space: O(n)"
      }
    ]
  },
  "sorting": {
    title: "Sorting Algorithms",
    description: "Algorithms that put elements in a certain order, important for organizing genetic data and preparing datasets for analysis.",
    algorithms: [
      {
        name: "Merge Sort",
        description: "Divide-and-conquer algorithm that splits, sorts, and combines arrays, stable and reliable for large datasets.",
        complexity: "Time: O(n log n), Space: O(n)"
      },
      {
        name: "Quick Sort",
        description: "Partition-based sorting algorithm, efficient for in-memory sorting of genomic data.",
        complexity: "Time: O(n log n) average, O(n²) worst, Space: O(log n)"
      },
      {
        name: "Radix Sort",
        description: "Non-comparative sorting that processes digits, useful for sorting sequence data of fixed length.",
        complexity: "Time: O(wn) where w is word size, Space: O(w+n)"
      },
      {
        name: "Topological Sort",
        description: "Sorts directed acyclic graphs into linear ordering, used in metabolic pathway analysis.",
        complexity: "Time: O(V+E), Space: O(V)"
      }
    ]
  },
  "dynamic-programming": {
    title: "Dynamic Programming",
    description: "Method for solving complex problems by breaking them down into simpler overlapping subproblems, essential for sequence alignment and structure prediction.",
    algorithms: [
      {
        name: "Needleman-Wunsch",
        description: "Global sequence alignment algorithm that maximizes similarity between sequences, fundamental in bioinformatics.",
        complexity: "Time: O(mn), Space: O(mn)"
      },
      {
        name: "Smith-Waterman",
        description: "Local sequence alignment algorithm for finding regions of similarity between sequences.",
        complexity: "Time: O(mn), Space: O(mn)"
      },
      {
        name: "Hidden Markov Models",
        description: "Statistical models used for pattern recognition in biological sequences and gene prediction.",
        complexity: "Time: O(n×k²) where k is states, Space: O(nk)"
      },
      {
        name: "RNA Secondary Structure Prediction",
        description: "Algorithms that predict how RNA folds onto itself, critical for understanding RNA function.",
        complexity: "Time: O(n³), Space: O(n²)"
      }
    ]
  },
  "string": {
    title: "String Algorithms",
    description: "Algorithms specifically designed for processing text data, crucial for DNA/RNA sequence analysis and pattern discovery.",
    algorithms: [
      {
        name: "Suffix Trees",
        description: "Data structure representing all suffixes of a string, enabling rapid pattern matching in genomic sequences.",
        complexity: "Construction: O(n), Search: O(m) where m is pattern length"
      },
      {
        name: "Burrows-Wheeler Transform",
        description: "Reversible transformation used in data compression and as the basis for efficient sequence alignment tools.",
        complexity: "Time: O(n), Space: O(n)"
      },
      {
        name: "Multiple Sequence Alignment",
        description: "Techniques for aligning three or more biological sequences, revealing evolutionary relationships.",
        complexity: "Time: O(nᵏ) where k is sequences, Space: O(nᵏ)"
      },
      {
        name: "De Bruijn Graph Construction",
        description: "Creates graphs from k-mers for genome assembly from short read sequencing data.",
        complexity: "Time: O(n), Space: O(n)"
      }
    ]
  },
  "numerical": {
    title: "Numerical Algorithms",
    description: "Methods for solving mathematical problems in bioinformatics, including statistical analysis and modeling of biological systems.",
    algorithms: [
      {
        name: "Principal Component Analysis (PCA)",
        description: "Dimensionality reduction technique widely used in gene expression analysis and population genetics.",
        complexity: "Time: O(min(np², n²p)) where n is samples and p is features"
      },
      {
        name: "Clustering Algorithms",
        description: "Methods for grouping similar biological data points, useful for gene expression analysis.",
        complexity: "Time: varies by algorithm, typically O(n²) or O(n log n)"
      },
      {
        name: "Maximum Likelihood Estimation",
        description: "Statistical method for parameter estimation in evolutionary models and sequence analysis.",
        complexity: "Time: varies by model complexity"
      },
      {
        name: "Markov Chain Monte Carlo",
        description: "Sampling techniques for approximating complex probability distributions in phylogenetics.",
        complexity: "Time: varies by model and convergence requirements"
      }
    ]
  }
};

const AlgorithmCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // Fallback if category doesn't exist
  if (!category || !algorithmData[category as keyof typeof algorithmData]) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16">
          <AnimatedContainer>
            <Button 
              variant="outline" 
              onClick={() => navigate('/algorithms')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Algorithms
            </Button>
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground">
              The algorithm category you're looking for doesn't exist.
            </p>
          </AnimatedContainer>
        </main>
        <Footer />
      </div>
    );
  }
  
  const data = algorithmData[category as keyof typeof algorithmData];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <Button 
            variant="outline" 
            onClick={() => navigate('/algorithms')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Button>
          
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <p className="text-muted-foreground mb-8">
            {data.description}
          </p>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Key Algorithms</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.algorithms.map((algo, index) => (
                <Card key={index} className="p-6 h-full hover:shadow-md transition-all">
                  <h3 className="text-xl font-semibold mb-2">{algo.name}</h3>
                  <p className="text-muted-foreground mb-4">{algo.description}</p>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    Complexity: {algo.complexity}
                  </div>
                </Card>
              ))}
            </div>
            
            <Card className="mt-12 p-6 bg-muted">
              <h2 className="text-xl font-bold mb-4">Applications in Bioinformatics</h2>
              <p className="text-muted-foreground">
                {data.title} are widely used in bioinformatics for tasks ranging from sequence analysis to structural predictions. 
                These algorithms form the foundation of many computational tools used in modern biological research.
              </p>
            </Card>
          </div>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlgorithmCategory;
