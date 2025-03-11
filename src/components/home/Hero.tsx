
import { Button } from '@/components/ui/button';
import { TestTube, ArrowRight, Book } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      {/* Decorative shapes */}
      <div className="absolute top-24 left-4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl" />
      
      <div className="container relative px-4 mx-auto text-center">
        <AnimatedContainer>
          <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <TestTube className="w-4 h-4 mr-2" />
            <span>Where algorithms meet biology</span>
          </div>
        </AnimatedContainer>
        
        <AnimatedContainer animation="slide-up" delay="short">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto mb-6 text-balance">
            Learn Data Structures & Algorithms Through Bioinformatics
          </h1>
        </AnimatedContainer>
        
        <AnimatedContainer animation="slide-up" delay="medium">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Master computer science fundamentals by tackling real-world biological problems. From DNA sequence alignment to protein folding, learn algorithms in context.
          </p>
        </AnimatedContainer>
        
        <AnimatedContainer animation="slide-up" delay="medium">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group">
              Start Learning
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="space-x-2">
              <Book className="w-4 h-4" />
              <span>Browse Curriculum</span>
            </Button>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default Hero;
