
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define types for our problems
type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  solved: boolean;
}

interface ProblemListProps {
  difficulty?: Difficulty;
  category?: string;
}

const ProblemList: React.FC<ProblemListProps> = ({ difficulty, category }) => {
  // Mock data for problems - in a real app, this would come from an API
  const problems: Problem[] = [
    {
      id: 1,
      title: "DNA Sequence Alignment",
      slug: "dna-sequence-alignment",
      difficulty: "medium",
      category: "dynamic-programming",
      solved: true
    },
    {
      id: 2,
      title: "Protein-Protein Interaction Network",
      slug: "protein-protein-interaction",
      difficulty: "hard",
      category: "graph-algorithms",
      solved: false
    },
    {
      id: 3,
      title: "Gene Expression Clustering",
      slug: "gene-expression-clustering",
      difficulty: "medium",
      category: "tree-data-structures",
      solved: false
    },
    {
      id: 4,
      title: "DNA Pattern Matching",
      slug: "dna-pattern-matching",
      difficulty: "easy",
      category: "search-algorithms",
      solved: true
    },
    {
      id: 5,
      title: "Phylogenetic Tree Construction",
      slug: "phylogenetic-tree",
      difficulty: "hard",
      category: "tree-data-structures",
      solved: false
    },
    {
      id: 6,
      title: "Genome Assembly",
      slug: "genome-assembly",
      difficulty: "hard",
      category: "combinatorial-algorithms",
      solved: false
    },
    {
      id: 7,
      title: "Motif Finding in DNA",
      slug: "motif-finding",
      difficulty: "medium",
      category: "search-algorithms",
      solved: false
    },
    {
      id: 8,
      title: "Gene Function Prediction",
      slug: "gene-function-prediction",
      difficulty: "medium",
      category: "machine-learning",
      solved: false
    },
    {
      id: 9,
      title: "Basic DNA Transcription",
      slug: "basic-dna-transcription",
      difficulty: "easy",
      category: "search-algorithms",
      solved: true
    },
    {
      id: 10,
      title: "Protein Structure Alignment",
      slug: "protein-structure-alignment",
      difficulty: "hard",
      category: "dynamic-programming",
      solved: false
    }
  ];

  // Filter problems based on props
  const filteredProblems = problems.filter(problem => {
    if (difficulty && problem.difficulty !== difficulty) return false;
    if (category && problem.category !== category) return false;
    return true;
  });

  // Helper to get difficulty color
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 font-medium text-sm text-muted-foreground px-4 py-2 border-b">
        <div className="col-span-1 flex justify-center">Status</div>
        <div className="col-span-6">Title</div>
        <div className="col-span-3">Category</div>
        <div className="col-span-2">Difficulty</div>
      </div>
      
      {filteredProblems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No problems found matching the current filters.
        </div>
      ) : (
        <ul>
          {filteredProblems.map((problem) => (
            <li key={problem.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
              <Link to={`/problem/${problem.slug}`} className="grid grid-cols-12 px-4 py-3 items-center">
                <div className="col-span-1 flex justify-center">
                  {problem.solved ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <Circle className="text-muted-foreground w-5 h-5" />
                  )}
                </div>
                <div className="col-span-6 font-medium">
                  {problem.title}
                </div>
                <div className="col-span-3 text-sm text-muted-foreground">
                  {problem.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                <div className={cn("col-span-2 text-sm", getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemList;
