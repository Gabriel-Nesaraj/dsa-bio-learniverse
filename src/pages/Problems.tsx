
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import ProblemList from '@/components/problems/ProblemList';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const Problems = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { id: 'graph-algorithms', name: 'Graph Algorithms' },
    { id: 'tree-data-structures', name: 'Tree Data Structures' },
    { id: 'search-algorithms', name: 'Search Algorithms' },
    { id: 'dynamic-programming', name: 'Dynamic Programming' },
    { id: 'machine-learning', name: 'Machine Learning' },
    { id: 'combinatorial-algorithms', name: 'Combinatorial Algorithms' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <h1 className="text-3xl font-bold mb-4">Practice Problems</h1>
          <p className="text-muted-foreground mb-8">
            Challenge yourself with a variety of bioinformatics problems to improve your DSA skills
          </p>
          
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
                <Tabs defaultValue="all" className="w-full">
                  <div className="px-4 py-3 border-b flex justify-between items-center">
                    <TabsList>
                      <TabsTrigger value="all">All Problems</TabsTrigger>
                      <TabsTrigger value="easy">Easy</TabsTrigger>
                      <TabsTrigger value="medium">Medium</TabsTrigger>
                      <TabsTrigger value="hard">Hard</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="all" className="m-0">
                    <ProblemList category={selectedCategory} />
                  </TabsContent>
                  <TabsContent value="easy" className="m-0">
                    <ProblemList difficulty="easy" category={selectedCategory} />
                  </TabsContent>
                  <TabsContent value="medium" className="m-0">
                    <ProblemList difficulty="medium" category={selectedCategory} />
                  </TabsContent>
                  <TabsContent value="hard" className="m-0">
                    <ProblemList difficulty="hard" category={selectedCategory} />
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
