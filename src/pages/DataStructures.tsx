
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Link } from 'react-router-dom';
import { ListTree, Network, AlignVerticalJustifyStart, Hash, PanelLeft, FileJson, CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Define problem type
interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  bioinformaticsConcepts?: string[];
}

const DataStructures = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Load problems from localStorage
    const storedProblems = localStorage.getItem('problems');
    let problemsList: Problem[] = [];
    
    if (storedProblems) {
      problemsList = JSON.parse(storedProblems);
    } else {
      // Same mock data as in ProblemList.tsx
      problemsList = [
        {
          id: 1,
          title: "DNA Sequence Alignment",
          slug: "dna-sequence-alignment",
          difficulty: "medium",
          category: "dynamic-programming",
          bioinformaticsConcepts: ["sequence-alignment", "genome-assembly"]
        },
        {
          id: 2,
          title: "Protein-Protein Interaction Network",
          slug: "protein-protein-interaction",
          difficulty: "hard",
          category: "graph-algorithms",
          bioinformaticsConcepts: ["protein-structure", "network-analysis"]
        },
        {
          id: 3,
          title: "Gene Expression Clustering",
          slug: "gene-expression-clustering",
          difficulty: "medium",
          category: "tree-data-structures",
          bioinformaticsConcepts: ["gene-expression", "phylogenetics"]
        },
        {
          id: 4,
          title: "DNA Pattern Matching",
          slug: "dna-pattern-matching",
          difficulty: "easy",
          category: "search-algorithms",
          bioinformaticsConcepts: ["sequence-alignment", "motif-finding"]
        },
        {
          id: 5,
          title: "Phylogenetic Tree Construction",
          slug: "phylogenetic-tree",
          difficulty: "hard",
          category: "tree-data-structures",
          bioinformaticsConcepts: ["phylogenetics"]
        },
        {
          id: 6,
          title: "Genome Assembly",
          slug: "genome-assembly",
          difficulty: "hard",
          category: "combinatorial-algorithms",
          bioinformaticsConcepts: ["genome-assembly", "next-gen-sequencing"]
        },
        {
          id: 7,
          title: "Motif Finding in DNA",
          slug: "motif-finding",
          difficulty: "medium",
          category: "search-algorithms",
          bioinformaticsConcepts: ["motif-finding"]
        },
        {
          id: 8,
          title: "Gene Function Prediction",
          slug: "gene-function-prediction",
          difficulty: "medium",
          category: "machine-learning",
          bioinformaticsConcepts: ["gene-expression"]
        },
        {
          id: 9,
          title: "Basic DNA Transcription",
          slug: "basic-dna-transcription",
          difficulty: "easy",
          category: "search-algorithms",
          bioinformaticsConcepts: ["sequence-alignment"]
        },
        {
          id: 10,
          title: "Protein Structure Alignment",
          slug: "protein-structure-alignment",
          difficulty: "hard",
          category: "dynamic-programming",
          bioinformaticsConcepts: ["protein-structure", "sequence-alignment"]
        }
      ];
      
      localStorage.setItem('problems', JSON.stringify(problemsList));
    }
    
    setProblems(problemsList);
    
    // Load solved problems
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const solved = new Set<number>(
        submissions
          .filter((s: any) => s.userId === user.id && s.status === 'accepted')
          .map((s: any) => Number(s.problemId))
      );
      setSolvedProblems(solved);
    }
  }, []);

  // Helper to get problems by data structure category
  const getProblemsByCategory = (category: string) => {
    return problems.filter(problem => {
      if (category === "trees") return problem.category === "tree-data-structures";
      if (category === "graphs") return problem.category === "graph-algorithms";
      if (category === "arrays-strings") return ["dynamic-programming", "search-algorithms"].includes(problem.category);
      if (category === "hash-tables") return problem.category === "search-algorithms";
      if (category === "stacks-queues") return problem.category === "combinatorial-algorithms";
      if (category === "advanced") return problem.category === "machine-learning";
      return false;
    });
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Helper to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return '';
    }
  };

  const dataStructures = [
    {
      title: "Trees",
      description: "Hierarchical structures including binary trees, B-trees, and phylogenetic trees used in genetic analysis",
      icon: <ListTree className="w-8 h-8 text-green-500" />,
      link: "/data-structures/trees",
      category: "trees"
    },
    {
      title: "Graphs",
      description: "Networks and connection structures used to represent interaction networks and pathways",
      icon: <Network className="w-8 h-8 text-blue-500" />,
      link: "/data-structures/graphs",
      category: "graphs"
    },
    {
      title: "Arrays & Strings",
      description: "Fundamental data structures for storing sequences, DNA/RNA, and protein data",
      icon: <AlignVerticalJustifyStart className="w-8 h-8 text-purple-500" />,
      link: "/data-structures/arrays-strings",
      category: "arrays-strings"
    },
    {
      title: "Hash Tables",
      description: "Fast lookup structures for k-mers, genetic sequences, and protein domains",
      icon: <Hash className="w-8 h-8 text-amber-500" />,
      link: "/data-structures/hash-tables",
      category: "hash-tables"
    },
    {
      title: "Stacks & Queues",
      description: "Linear structures used in algorithm implementations and biological process modeling",
      icon: <PanelLeft className="w-8 h-8 text-indigo-500" />,
      link: "/data-structures/stacks-queues",
      category: "stacks-queues"
    },
    {
      title: "Advanced Structures",
      description: "Specialized structures like suffix trees, de Bruijn graphs, and bloom filters",
      icon: <FileJson className="w-8 h-8 text-pink-500" />,
      link: "/data-structures/advanced",
      category: "advanced"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <h1 className="text-3xl font-bold mb-4">Data Structures in Bioinformatics</h1>
          <p className="text-muted-foreground mb-8">
            Explore the essential data structures used in bioinformatics for efficient data organization and processing
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataStructures.map((ds, index) => {
              const categoryProblems = getProblemsByCategory(ds.category);
              const isExpanded = expandedCategory === ds.category;
              
              return (
                <Card key={index} className="p-6 h-full hover:shadow-md transition-all border">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 flex justify-between items-center">
                      {ds.icon}
                      <Badge variant="outline" className="text-xs">
                        {categoryProblems.length} problems
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{ds.title}</h2>
                    <p className="text-muted-foreground text-sm mb-4">{ds.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <Link to={ds.link} className="text-primary text-sm hover:underline">
                        View all details
                      </Link>
                      
                      <button 
                        onClick={() => toggleCategory(ds.category)} 
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                      >
                        {categoryProblems.length > 0 ? (
                          <>
                            Practice Problems
                            {isExpanded ? (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronRight className="ml-1 h-4 w-4" />
                            )}
                          </>
                        ) : "No practice problems"}
                      </button>
                    </div>
                    
                    {/* Problems list - only shown when expanded */}
                    {isExpanded && categoryProblems.length > 0 && (
                      <div className="mt-4 space-y-2 border-t pt-4">
                        <h3 className="font-medium text-sm">Practice Problems:</h3>
                        <ul className="space-y-2">
                          {categoryProblems.map(problem => (
                            <li key={problem.id} className="flex items-center gap-2 text-sm">
                              {solvedProblems.has(problem.id) ? (
                                <CheckCircle2 className="text-green-500 w-4 h-4 flex-shrink-0" />
                              ) : (
                                <Circle className="text-muted-foreground w-4 h-4 flex-shrink-0" />
                              )}
                              <Link to={`/problem/${problem.slug}`} className="flex-grow truncate hover:text-primary">
                                {problem.title}
                              </Link>
                              <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-12 bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Why Data Structures Matter in Bioinformatics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Efficiency</h3>
                <p className="text-muted-foreground text-sm">
                  Biological data is often massive. Using the right data structure can be the difference between 
                  an algorithm running in minutes versus days.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Representation</h3>
                <p className="text-muted-foreground text-sm">
                  Biological systems have inherent structures (networks, hierarchies) that can be naturally 
                  represented with the right data structures.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Many bioinformatics analyses rely on specific data structures like suffix trees for 
                  pattern matching or graphs for pathway analysis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Memory Management</h3>
                <p className="text-muted-foreground text-sm">
                  Working with genomic data often pushes hardware limits, making memory-efficient data 
                  structures essential for large-scale analysis.
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

export default DataStructures;
