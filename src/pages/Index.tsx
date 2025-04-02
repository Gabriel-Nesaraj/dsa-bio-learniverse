
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Network,
  ListTree,
  Search,
  AlignLeft,
  GraduationCap,
  BookOpenCheck,
  Code,
  CheckCircle2,
  Clock,
  BarChart3,
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ProblemList from '@/components/problems/ProblemList';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Define Problem type for displaying categories
type Problem = {
  id: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  bioinformaticsConcepts?: string[];
};

const Index = () => {
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsByCategory, setProblemsByCategory] = useState<Record<string, Problem[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Load problems when component mounts
  useEffect(() => {
    const storedProblems = localStorage.getItem('problems');
    if (storedProblems) {
      const loadedProblems = JSON.parse(storedProblems);
      setProblems(loadedProblems);
      
      // Group problems by category
      const groupedProblems: Record<string, Problem[]> = {};
      loadedProblems.forEach((problem: Problem) => {
        if (!groupedProblems[problem.category]) {
          groupedProblems[problem.category] = [];
        }
        groupedProblems[problem.category].push(problem);
      });
      setProblemsByCategory(groupedProblems);
    }
  }, []);
  
  const bioinformaticsConcepts = [
    { id: 'sequence-alignment', name: 'Sequence Alignment' },
    { id: 'genome-assembly', name: 'Genome Assembly' },
    { id: 'phylogenetics', name: 'Phylogenetics' },
    { id: 'protein-structure', name: 'Protein Structure' },
    { id: 'gene-expression', name: 'Gene Expression' },
    { id: 'motif-finding', name: 'Motif Finding' },
    { id: 'network-analysis', name: 'Network Analysis' },
    { id: 'next-gen-sequencing', name: 'Next-Gen Sequencing' },
  ];
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };
  
  const handleToggleConcept = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId) 
        ? prev.filter(id => id !== conceptId) 
        : [...prev, conceptId]
    );
  };
  
  const handleToggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty) 
        : [...prev, difficulty]
    );
  };
  
  const resetFilters = () => {
    setSelectedConcepts([]);
    setSelectedDifficulties([]);
  };
  
  // Helper function to get category name from slug
  const getCategoryName = (categorySlug: string): string => {
    return categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Helper to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">BioDSA: Learn DSA through Bioinformatics</h1>
          <p className="text-muted-foreground">
            Master data structures and algorithms by solving real-world bioinformatics problems
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar with problem categories */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Problem Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => toggleCategory('graph-algorithms')}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <Network className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Graph Algorithms</span>
                    </div>
                    {problemsByCategory['graph-algorithms'] && (
                      expandedCategory === 'graph-algorithms' ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategory === 'graph-algorithms' && problemsByCategory['graph-algorithms'] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {problemsByCategory['graph-algorithms'].map(problem => (
                        <li key={problem.id}>
                          <Link to={`/problem/${problem.slug}`} className="text-sm flex items-center gap-1 p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            {problem.title}
                          </Link>
                        </li>
                      ))}
                      {problemsByCategory['graph-algorithms'].length > 3 && (
                        <li>
                          <Link to="/problems/graph-algorithms" className="text-xs text-primary hover:underline ml-3">
                            View all ({problemsByCategory['graph-algorithms'].length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
                <li>
                  <button 
                    onClick={() => toggleCategory('tree-data-structures')}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <ListTree className="w-4 h-4 text-green-500 mr-2" />
                      <span>Tree Data Structures</span>
                    </div>
                    {problemsByCategory['tree-data-structures'] && (
                      expandedCategory === 'tree-data-structures' ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategory === 'tree-data-structures' && problemsByCategory['tree-data-structures'] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {problemsByCategory['tree-data-structures'].map(problem => (
                        <li key={problem.id}>
                          <Link to={`/problem/${problem.slug}`} className="text-sm flex items-center gap-1 p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            {problem.title}
                          </Link>
                        </li>
                      ))}
                      {problemsByCategory['tree-data-structures'].length > 3 && (
                        <li>
                          <Link to="/problems/tree-data-structures" className="text-xs text-primary hover:underline ml-3">
                            View all ({problemsByCategory['tree-data-structures'].length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
                <li>
                  <button 
                    onClick={() => toggleCategory('search-algorithms')}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <Search className="w-4 h-4 text-purple-500 mr-2" />
                      <span>Search Algorithms</span>
                    </div>
                    {problemsByCategory['search-algorithms'] && (
                      expandedCategory === 'search-algorithms' ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategory === 'search-algorithms' && problemsByCategory['search-algorithms'] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {problemsByCategory['search-algorithms'].map(problem => (
                        <li key={problem.id}>
                          <Link to={`/problem/${problem.slug}`} className="text-sm flex items-center gap-1 p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            {problem.title}
                          </Link>
                        </li>
                      ))}
                      {problemsByCategory['search-algorithms'].length > 3 && (
                        <li>
                          <Link to="/problems/search-algorithms" className="text-xs text-primary hover:underline ml-3">
                            View all ({problemsByCategory['search-algorithms'].length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
                <li>
                  <button 
                    onClick={() => toggleCategory('dynamic-programming')}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <AlignLeft className="w-4 h-4 text-amber-500 mr-2" />
                      <span>Dynamic Programming</span>
                    </div>
                    {problemsByCategory['dynamic-programming'] && (
                      expandedCategory === 'dynamic-programming' ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategory === 'dynamic-programming' && problemsByCategory['dynamic-programming'] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {problemsByCategory['dynamic-programming'].map(problem => (
                        <li key={problem.id}>
                          <Link to={`/problem/${problem.slug}`} className="text-sm flex items-center gap-1 p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            {problem.title}
                          </Link>
                        </li>
                      ))}
                      {problemsByCategory['dynamic-programming'].length > 3 && (
                        <li>
                          <Link to="/problems/dynamic-programming" className="text-xs text-primary hover:underline ml-3">
                            View all ({problemsByCategory['dynamic-programming'].length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
                <li>
                  <button 
                    onClick={() => toggleCategory('machine-learning')}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-pink-500 mr-2" />
                      <span>Machine Learning</span>
                    </div>
                    {problemsByCategory['machine-learning'] && (
                      expandedCategory === 'machine-learning' ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategory === 'machine-learning' && problemsByCategory['machine-learning'] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {problemsByCategory['machine-learning'].map(problem => (
                        <li key={problem.id}>
                          <Link to={`/problem/${problem.slug}`} className="text-sm flex items-center gap-1 p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            {problem.title}
                          </Link>
                        </li>
                      ))}
                      {problemsByCategory['machine-learning'].length > 3 && (
                        <li>
                          <Link to="/problems/machine-learning" className="text-xs text-primary hover:underline ml-3">
                            View all ({problemsByCategory['machine-learning'].length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
                <li>
                  <button 
                    onClick={() => toggleCategory('combinatorial-algorithms')}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <BookOpenCheck className="w-4 h-4 text-indigo-500 mr-2" />
                      <span>Combinatorial Algorithms</span>
                    </div>
                    {problemsByCategory['combinatorial-algorithms'] && (
                      expandedCategory === 'combinatorial-algorithms' ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCategory === 'combinatorial-algorithms' && problemsByCategory['combinatorial-algorithms'] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {problemsByCategory['combinatorial-algorithms'].map(problem => (
                        <li key={problem.id}>
                          <Link to={`/problem/${problem.slug}`} className="text-sm flex items-center gap-1 p-1 rounded-md hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(problem.difficulty)}`}></span>
                            {problem.title}
                          </Link>
                        </li>
                      ))}
                      {problemsByCategory['combinatorial-algorithms'].length > 3 && (
                        <li>
                          <Link to="/problems/combinatorial-algorithms" className="text-xs text-primary hover:underline ml-3">
                            View all ({problemsByCategory['combinatorial-algorithms'].length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              </ul>
            </Card>
          </div>
          
          {/* Main content area with problem list */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <Tabs defaultValue="all" className="w-full">
                <div className="px-4 py-3 border-b flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Problems</TabsTrigger>
                    <TabsTrigger value="easy">Easy</TabsTrigger>
                    <TabsTrigger value="medium">Medium</TabsTrigger>
                    <TabsTrigger value="hard">Hard</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-1" />
                          Filter
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filter Problems</SheetTitle>
                          <SheetDescription>
                            Narrow down problems by difficulty and concepts
                          </SheetDescription>
                        </SheetHeader>
                        
                        <div className="py-4">
                          <h3 className="text-sm font-medium mb-3">Difficulty</h3>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="difficulty-easy" 
                                checked={selectedDifficulties.includes('easy')}
                                onCheckedChange={() => handleToggleDifficulty('easy')}
                              />
                              <Label htmlFor="difficulty-easy" className="text-green-500">Easy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="difficulty-medium" 
                                checked={selectedDifficulties.includes('medium')}
                                onCheckedChange={() => handleToggleDifficulty('medium')}
                              />
                              <Label htmlFor="difficulty-medium" className="text-yellow-600">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="difficulty-hard" 
                                checked={selectedDifficulties.includes('hard')}
                                onCheckedChange={() => handleToggleDifficulty('hard')}
                              />
                              <Label htmlFor="difficulty-hard" className="text-red-500">Hard</Label>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <h3 className="text-sm font-medium mb-3">Bioinformatics Concepts</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {bioinformaticsConcepts.map(concept => (
                              <div key={concept.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`concept-${concept.id}`} 
                                  checked={selectedConcepts.includes(concept.id)}
                                  onCheckedChange={() => handleToggleConcept(concept.id)}
                                />
                                <Label htmlFor={`concept-${concept.id}`}>{concept.name}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <SheetFooter>
                          <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                          <SheetClose asChild>
                            <Button>Apply Filters</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                
                <TabsContent value="all" className="m-0">
                  <ProblemList 
                    concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                    difficulties={selectedDifficulties.length > 0 ? selectedDifficulties : undefined}
                  />
                </TabsContent>
                <TabsContent value="easy" className="m-0">
                  <ProblemList 
                    difficulty="easy"
                    concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                  />
                </TabsContent>
                <TabsContent value="medium" className="m-0">
                  <ProblemList 
                    difficulty="medium"
                    concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                  />
                </TabsContent>
                <TabsContent value="hard" className="m-0">
                  <ProblemList 
                    difficulty="hard"
                    concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
        
        {/* Call to action section */}
        <AnimatedContainer className="mt-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to start solving?</h2>
          <p className="text-muted-foreground mb-6">
            Challenge yourself with real-world bioinformatics problems and improve your DSA skills.
          </p>
          <Button size="lg" asChild>
            <Link to="/problems">
              Start Solving Now
            </Link>
          </Button>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
