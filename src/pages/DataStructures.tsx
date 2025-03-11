
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Link } from 'react-router-dom';
import { ListTree, Network, AlignVerticalJustifyStart, Hash, PanelLeft, FileJson } from 'lucide-react';

const DataStructures = () => {
  const dataStructures = [
    {
      title: "Trees",
      description: "Hierarchical structures including binary trees, B-trees, and phylogenetic trees used in genetic analysis",
      icon: <ListTree className="w-8 h-8 text-green-500" />,
      link: "/data-structures/trees"
    },
    {
      title: "Graphs",
      description: "Networks and connection structures used to represent interaction networks and pathways",
      icon: <Network className="w-8 h-8 text-blue-500" />,
      link: "/data-structures/graphs"
    },
    {
      title: "Arrays & Strings",
      description: "Fundamental data structures for storing sequences, DNA/RNA, and protein data",
      icon: <AlignVerticalJustifyStart className="w-8 h-8 text-purple-500" />,
      link: "/data-structures/arrays-strings"
    },
    {
      title: "Hash Tables",
      description: "Fast lookup structures for k-mers, genetic sequences, and protein domains",
      icon: <Hash className="w-8 h-8 text-amber-500" />,
      link: "/data-structures/hash-tables"
    },
    {
      title: "Stacks & Queues",
      description: "Linear structures used in algorithm implementations and biological process modeling",
      icon: <PanelLeft className="w-8 h-8 text-indigo-500" />,
      link: "/data-structures/stacks-queues"
    },
    {
      title: "Advanced Structures",
      description: "Specialized structures like suffix trees, de Bruijn graphs, and bloom filters",
      icon: <FileJson className="w-8 h-8 text-pink-500" />,
      link: "/data-structures/advanced"
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
            {dataStructures.map((ds, index) => (
              <Link to={ds.link} key={index}>
                <Card className="p-6 h-full hover:shadow-md transition-all hover:border-primary/50">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {ds.icon}
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{ds.title}</h2>
                    <p className="text-muted-foreground text-sm flex-grow">{ds.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
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
