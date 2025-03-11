
import React from 'react';
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
  Filter
} from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ProblemList from '@/components/problems/ProblemList';

const Index = () => {
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
                  <Link to="/problems/graph-algorithms" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <Network className="w-4 h-4 text-blue-500" />
                    <span>Graph Algorithms</span>
                  </Link>
                </li>
                <li>
                  <Link to="/problems/tree-data-structures" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <ListTree className="w-4 h-4 text-green-500" />
                    <span>Tree Data Structures</span>
                  </Link>
                </li>
                <li>
                  <Link to="/problems/search-algorithms" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <Search className="w-4 h-4 text-purple-500" />
                    <span>Search Algorithms</span>
                  </Link>
                </li>
                <li>
                  <Link to="/problems/dynamic-programming" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <AlignLeft className="w-4 h-4 text-amber-500" />
                    <span>Dynamic Programming</span>
                  </Link>
                </li>
                <li>
                  <Link to="/problems/machine-learning" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <GraduationCap className="w-4 h-4 text-pink-500" />
                    <span>Machine Learning</span>
                  </Link>
                </li>
                <li>
                  <Link to="/problems/combinatorial-algorithms" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <BookOpenCheck className="w-4 h-4 text-indigo-500" />
                    <span>Combinatorial Algorithms</span>
                  </Link>
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
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="all" className="m-0">
                  <ProblemList />
                </TabsContent>
                <TabsContent value="easy" className="m-0">
                  <ProblemList difficulty="easy" />
                </TabsContent>
                <TabsContent value="medium" className="m-0">
                  <ProblemList difficulty="medium" />
                </TabsContent>
                <TabsContent value="hard" className="m-0">
                  <ProblemList difficulty="hard" />
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
