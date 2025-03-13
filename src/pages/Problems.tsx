
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import ProblemList from '@/components/problems/ProblemList';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Input } from '@/components/ui/input';
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
import { Separator } from '@/components/ui/separator';

const Problems = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const categories = [
    { id: 'graph-algorithms', name: 'Graph Algorithms' },
    { id: 'tree-data-structures', name: 'Tree Data Structures' },
    { id: 'search-algorithms', name: 'Search Algorithms' },
    { id: 'dynamic-programming', name: 'Dynamic Programming' },
    { id: 'machine-learning', name: 'Machine Learning' },
    { id: 'combinatorial-algorithms', name: 'Combinatorial Algorithms' },
  ];
  
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
    setSelectedCategory(null);
  };
  
  // Pass search and filters to the ProblemList
  const getFilteredDifficulty = () => {
    if (activeTab !== 'all') return activeTab;
    if (selectedDifficulties.length === 1) return selectedDifficulties[0];
    return undefined;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <h1 className="text-3xl font-bold mb-4">Practice Problems</h1>
          <p className="text-muted-foreground mb-8">
            Challenge yourself with a variety of bioinformatics problems to improve your DSA skills
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search problems by title or keyword..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {(selectedConcepts.length > 0 || selectedDifficulties.length > 0) && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {selectedConcepts.length + selectedDifficulties.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Problems</SheetTitle>
                  <SheetDescription>
                    Narrow down problems by difficulty, concepts, or categories
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
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={selectedCategory === category.id}
                          onCheckedChange={() => {
                            if (selectedCategory === category.id) {
                              setSelectedCategory(null);
                            } else {
                              setSelectedCategory(category.id);
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category filter sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h2 className="font-semibold mb-4">Filter by Category</h2>
                <ul className="space-y-1">
                  <li>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left p-2 rounded-md transition-colors ${!selectedCategory ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button 
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left p-2 rounded-md transition-colors ${selectedCategory === category.id ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            
            {/* Problem list */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                  <div className="px-4 py-3 border-b flex justify-between items-center">
                    <TabsList>
                      <TabsTrigger value="all">All Problems</TabsTrigger>
                      <TabsTrigger value="easy">Easy</TabsTrigger>
                      <TabsTrigger value="medium">Medium</TabsTrigger>
                      <TabsTrigger value="hard">Hard</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="all" className="m-0">
                    <ProblemList 
                      category={selectedCategory} 
                      searchQuery={searchQuery}
                      concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                      difficulties={selectedDifficulties.length > 0 ? selectedDifficulties : undefined}
                    />
                  </TabsContent>
                  <TabsContent value="easy" className="m-0">
                    <ProblemList 
                      difficulty="easy" 
                      category={selectedCategory}
                      searchQuery={searchQuery}
                      concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                    />
                  </TabsContent>
                  <TabsContent value="medium" className="m-0">
                    <ProblemList 
                      difficulty="medium" 
                      category={selectedCategory}
                      searchQuery={searchQuery}
                      concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                    />
                  </TabsContent>
                  <TabsContent value="hard" className="m-0">
                    <ProblemList 
                      difficulty="hard" 
                      category={selectedCategory}
                      searchQuery={searchQuery}
                      concepts={selectedConcepts.length > 0 ? selectedConcepts : undefined}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Problems;
