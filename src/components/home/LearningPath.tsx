
import { useState } from 'react';
import { Check, ChevronRight, Microscope, Binary, Dna, Network, FileCode, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Separator } from '@/components/ui/separator';

interface PathStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  isLocked?: boolean;
}

const PathStep = ({ 
  step, 
  title, 
  description, 
  icon, 
  isActive, 
  isCompleted, 
  onClick, 
  isLocked = false 
}: PathStepProps) => {
  return (
    <div 
      className={cn(
        "relative flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all",
        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary",
        isLocked && "opacity-50"
      )} 
      onClick={isLocked ? undefined : onClick}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border",
        isCompleted ? "bg-primary border-primary text-white" : 
        isActive ? "border-primary/50 text-primary" : "border-muted-foreground/30"
      )}>
        {isCompleted ? <Check className="w-5 h-5" /> : isLocked ? <Lock className="w-5 h-5" /> : icon}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center">
          <div className="text-xs font-medium text-muted-foreground">Step {step}</div>
          {isCompleted && (
            <div className="ml-2 text-xs font-medium text-primary">Completed</div>
          )}
        </div>
        <h3 className="font-medium mt-1 flex items-center">
          {title}
          {!isLocked && <ChevronRight className={cn(
            "ml-1 w-4 h-4 transition-transform",
            isActive ? "transform rotate-90" : ""
          )} />}
        </h3>
        {isActive && (
          <AnimatedContainer animation="slide-up">
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </AnimatedContainer>
        )}
      </div>
    </div>
  );
};

const LearningPath = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (step: number) => {
    setActiveStep(activeStep === step ? -1 : step);
  };

  const pathSteps = [
    {
      step: 1,
      title: "Introduction to Bioinformatics",
      description: "Learn the fundamentals of bioinformatics and how it intersects with computer science. Explore the basic biological concepts needed to understand the algorithms.",
      icon: <Microscope className="w-5 h-5" />,
      isLocked: false
    },
    {
      step: 2,
      title: "Algorithmic Thinking",
      description: "Develop problem-solving skills through algorithmic thinking. Learn how to break down complex biological problems into computational steps.",
      icon: <Binary className="w-5 h-5" />,
      isLocked: false
    },
    {
      step: 3,
      title: "Sequence Alignment Algorithms",
      description: "Master fundamental algorithms used for DNA and protein sequence alignment, including dynamic programming approaches like Needleman-Wunsch and Smith-Waterman.",
      icon: <Dna className="w-5 h-5" />,
      isLocked: false
    },
    {
      step: 4,
      title: "Graph Algorithms in Genomics",
      description: "Explore how graph data structures and algorithms are used to assemble genomes, analyze genetic networks, and study protein-protein interactions.",
      icon: <Network className="w-5 h-5" />,
      isLocked: true
    },
    {
      step: 5,
      title: "Advanced Bioinformatics Algorithms",
      description: "Dive deep into specialized algorithms for protein structure prediction, phylogenetic tree construction, and gene expression analysis.",
      icon: <FileCode className="w-5 h-5" />,
      isLocked: true
    }
  ];

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Learning Journey</h2>
          <p className="text-muted-foreground">
            Follow our structured learning path to master data structures and algorithms through real-world bioinformatics applications.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {pathSteps.map((path, index) => (
              <div key={path.step}>
                <PathStep
                  {...path}
                  isActive={activeStep === path.step}
                  isCompleted={completedSteps.includes(path.step)}
                  onClick={() => toggleStep(path.step)}
                />
                {index < pathSteps.length - 1 && (
                  <div className="ml-7 my-1 h-8">
                    <Separator orientation="vertical" className="h-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
