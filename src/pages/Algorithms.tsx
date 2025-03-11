
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Search, Network, ArrowRightLeft, Braces, LineChart, AlignLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Algorithms = () => {
  const algorithmCategories = [
    {
      title: "Graph Algorithms",
      description: "Algorithms that work on graph data structures including traversals, shortest paths, and network flows",
      icon: <Network className="w-8 h-8 text-blue-500" />,
      link: "/algorithms/graph"
    },
    {
      title: "Search Algorithms",
      description: "Methods for finding elements with specific properties within collections of data",
      icon: <Search className="w-8 h-8 text-purple-500" />,
      link: "/algorithms/search"
    },
    {
      title: "Sorting Algorithms",
      description: "Techniques for rearranging elements in a specific order, important for efficient data processing",
      icon: <ArrowRightLeft className="w-8 h-8 text-green-500" />,
      link: "/algorithms/sorting"
    },
    {
      title: "Dynamic Programming",
      description: "Method for solving complex problems by breaking them down into simpler subproblems",
      icon: <AlignLeft className="w-8 h-8 text-amber-500" />,
      link: "/algorithms/dynamic-programming"
    },
    {
      title: "String Algorithms",
      description: "Specialized algorithms for processing and manipulating text and sequence data",
      icon: <Braces className="w-8 h-8 text-indigo-500" />,
      link: "/algorithms/string"
    },
    {
      title: "Numerical Algorithms",
      description: "Methods for solving mathematical problems common in bioinformatics analysis",
      icon: <LineChart className="w-8 h-8 text-pink-500" />,
      link: "/algorithms/numerical"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <h1 className="text-3xl font-bold mb-4">Bioinformatics Algorithms</h1>
          <p className="text-muted-foreground mb-8">
            Explore algorithms commonly used in bioinformatics, learn the theory and practice with problems
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithmCategories.map((category, index) => (
              <Link to={category.link} key={index}>
                <Card className="p-6 h-full hover:shadow-md transition-all hover:border-primary/50">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
                    <p className="text-muted-foreground text-sm flex-grow">{category.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Learning Path</h2>
            <p className="text-muted-foreground mb-6">
              We recommend starting with fundamental algorithms before moving to more specialized ones.
              Each algorithm includes theory, examples, and practice problems to solidify your understanding.
            </p>
          </div>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Algorithms;
