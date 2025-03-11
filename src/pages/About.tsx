
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from "@/components/ui/card";
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Brain, Code, GraduationCap, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About BioDSA</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn data structures and algorithms through the lens of biological problems and challenges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Brain className="w-6 h-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground flex-grow">
                  BioDSA was created to bridge the gap between computer science fundamentals and 
                  biological research. We believe that learning data structures and algorithms is 
                  most effective when applied to real-world problems, and bioinformatics provides 
                  a rich set of challenges that require computational solutions.
                </p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <GraduationCap className="w-6 h-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Educational Philosophy</h2>
                </div>
                <p className="text-muted-foreground flex-grow">
                  Our platform is built around problem-based learning, where you tackle increasingly 
                  complex bioinformatics challenges that require specific data structures and algorithms 
                  to solve efficiently. This approach helps solidify your understanding of both the 
                  computer science concepts and their applications in biology.
                </p>
              </div>
            </Card>
          </div>
          
          <div className="bg-muted p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Learn DSA Through Bioinformatics?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Real-world Applications</h3>
                <p className="text-sm text-muted-foreground">
                  Apply your skills to problems that scientists are solving today in genomics, 
                  proteomics, and drug discovery.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Interdisciplinary Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Develop both computational thinking and biological knowledge, 
                  making you valuable in multiple fields.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Growing Field</h3>
                <p className="text-sm text-muted-foreground">
                  Bioinformatics is rapidly expanding, with high demand for professionals 
                  who understand both computing and biology.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              BioDSA was created by a team of bioinformaticians, computer scientists, and educators 
              passionate about making computational biology accessible to all.
            </p>
            <p className="text-sm text-muted-foreground">
              Want to contribute? <a href="#" className="text-primary hover:underline">Join our open-source community</a>
            </p>
          </div>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
