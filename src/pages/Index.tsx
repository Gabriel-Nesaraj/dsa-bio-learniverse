
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ModuleCard from '@/components/home/ModuleCard';
import LearningPath from '@/components/home/LearningPath';
import VisualComponent from '@/components/home/VisualComponent';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { 
  Network, 
  ListTree, 
  Search, 
  AlignLeft, 
  GraduationCap, 
  BookOpenCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Module data for our cards
  const modules = [
    {
      title: "Graph Algorithms",
      description: "Explore graph algorithms like DFS, BFS, and Dijkstra's algorithm in the context of protein-protein interaction networks.",
      icon: <Network className="w-6 h-6" />,
      link: "/modules/graph-algorithms",
      accentColor: "bg-blue-100 text-blue-600"
    },
    {
      title: "Tree Data Structures",
      description: "Learn about tree data structures through the lens of phylogenetic trees and hierarchical clustering of gene expression data.",
      icon: <ListTree className="w-6 h-6" />,
      link: "/modules/tree-data-structures",
      accentColor: "bg-green-100 text-green-600"
    },
    {
      title: "Search Algorithms",
      description: "Master various search algorithms and their applications in finding patterns in DNA sequences and database searches.",
      icon: <Search className="w-6 h-6" />,
      link: "/modules/search-algorithms",
      accentColor: "bg-purple-100 text-purple-600"
    },
    {
      title: "Dynamic Programming",
      description: "Understand dynamic programming through sequence alignment algorithms like Needleman-Wunsch and Smith-Waterman.",
      icon: <AlignLeft className="w-6 h-6" />,
      link: "/modules/dynamic-programming",
      accentColor: "bg-amber-100 text-amber-600"
    },
    {
      title: "Machine Learning",
      description: "Apply machine learning algorithms to predict protein structure, gene function, and disease associations.",
      icon: <GraduationCap className="w-6 h-6" />,
      link: "/modules/machine-learning",
      accentColor: "bg-pink-100 text-pink-600"
    },
    {
      title: "Combinatorial Algorithms",
      description: "Explore combinatorial algorithms for motif finding, primer design, and sequence assembly problems.",
      icon: <BookOpenCheck className="w-6 h-6" />,
      link: "/modules/combinatorial-algorithms",
      accentColor: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Modules Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <AnimatedContainer>
                <h2 className="text-3xl font-bold mb-4">Explore Learning Modules</h2>
                <p className="text-muted-foreground">
                  Discover how classic algorithms and data structures are applied to solve complex biological problems.
                </p>
              </AnimatedContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, i) => (
                <AnimatedContainer key={module.title} animation="scale" delay={i < 3 ? 'none' : i < 6 ? 'short' : 'medium'}>
                  <ModuleCard {...module} />
                </AnimatedContainer>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                View All Modules
              </Button>
            </div>
          </div>
        </section>
        
        {/* Learning Path Section */}
        <LearningPath />
        
        {/* Visual Component Section */}
        <VisualComponent />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 mx-auto text-center">
            <AnimatedContainer className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of students who are learning data structures and algorithms through the lens of bioinformatics.
              </p>
              <Button size="lg">Begin Learning Now</Button>
            </AnimatedContainer>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
