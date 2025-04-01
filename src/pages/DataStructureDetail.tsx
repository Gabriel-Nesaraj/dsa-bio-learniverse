
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProblemList from '@/components/problems/ProblemList';
import { cn } from '@/lib/utils';

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  bioinformaticsConcepts?: string[];
}

const dataStructureInfo = {
  trees: {
    title: "Trees in Bioinformatics",
    description: "Trees are hierarchical data structures that are widely used in bioinformatics for representing evolutionary relationships, taxonomic classifications, and hierarchical clustering of biological data.",
    categories: ["tree-data-structures"]
  },
  graphs: {
    title: "Graphs in Bioinformatics",
    description: "Graphs are used to represent networks of interactions between biological entities, such as protein-protein interaction networks, metabolic pathways, and regulatory networks.",
    categories: ["graph-algorithms"]
  },
  "arrays-strings": {
    title: "Arrays & Strings in Bioinformatics",
    description: "Arrays and strings are fundamental data structures used to store and manipulate biological sequences like DNA, RNA, and proteins.",
    categories: ["dynamic-programming", "search-algorithms"]
  },
  "hash-tables": {
    title: "Hash Tables in Bioinformatics",
    description: "Hash tables provide efficient lookup operations for biological data such as k-mers, motifs, and sequence patterns.",
    categories: ["search-algorithms"]
  },
  "stacks-queues": {
    title: "Stacks & Queues in Bioinformatics",
    description: "These linear data structures are used in algorithm implementations for sequence analysis, pathway finding, and biological process modeling.",
    categories: ["combinatorial-algorithms"]
  },
  advanced: {
    title: "Advanced Data Structures in Bioinformatics",
    description: "Specialized structures like suffix trees, de Bruijn graphs, and bloom filters that are crucial for efficient genomic data processing.",
    categories: ["machine-learning"]
  }
};

const DataStructureDetail = () => {
  const { category } = useParams<{ category: string }>();
  const [problems, setProblems] = useState<Problem[]>([]);
  
  useEffect(() => {
    // Load problems from localStorage
    const storedProblems = localStorage.getItem('problems');
    if (storedProblems) {
      const allProblems = JSON.parse(storedProblems);
      setProblems(allProblems);
    }
  }, []);
  
  // Safety check for unknown category
  if (!category || !dataStructureInfo[category as keyof typeof dataStructureInfo]) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16">
          <AnimatedContainer>
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The data structure category you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to="/data-structures">Back to Data Structures</Link>
              </Button>
            </div>
          </AnimatedContainer>
        </main>
        <Footer />
      </div>
    );
  }
  
  const info = dataStructureInfo[category as keyof typeof dataStructureInfo];
  
  // Get relevant problems for this category
  const filteredProblems = problems.filter(problem => {
    if (category === "trees") return problem.category === "tree-data-structures";
    if (category === "graphs") return problem.category === "graph-algorithms";
    if (category === "arrays-strings") return ["dynamic-programming", "search-algorithms"].includes(problem.category);
    if (category === "hash-tables") return problem.category === "search-algorithms";
    if (category === "stacks-queues") return problem.category === "combinatorial-algorithms";
    if (category === "advanced") return problem.category === "machine-learning";
    return false;
  });
  
  // Helper to get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <div className="mb-8">
            <Link to="/data-structures" className="text-muted-foreground inline-flex items-center hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Data Structures
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">{info.title}</h1>
            <p className="text-muted-foreground max-w-3xl">
              {info.description}
            </p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Practice Problems</h2>
            
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  No problems available in this category yet.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 border-b">
                  <h3 className="font-medium">{filteredProblems.length} Problems</h3>
                </div>
                
                <ul className="divide-y">
                  {filteredProblems.map(problem => (
                    <li key={problem.id} className="hover:bg-muted/50 transition-colors">
                      <Link to={`/problem/${problem.slug}`} className="block px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-medium">{problem.title}</span>
                            <Badge variant="outline" className={cn(getDifficultyColor(problem.difficulty))}>
                              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                            </Badge>
                          </div>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                        {problem.bioinformaticsConcepts && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {problem.bioinformaticsConcepts.map(concept => (
                              <Badge key={concept} variant="secondary" className="text-xs">
                                {concept.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-12 bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Learn More</h3>
                <p className="text-muted-foreground text-sm">
                  Check out our tutorials and articles about {info.title.toLowerCase()} in bioinformatics.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Related Topics</h3>
                <p className="text-muted-foreground text-sm">
                  Explore related algorithms and techniques commonly used with {info.title.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataStructureDetail;
