
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Code, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import mongoService from '@/services/mongoService';

// Define types for our problems
type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  bioinformaticsConcepts?: string[];
}

interface ProblemListProps {
  difficulty?: Difficulty;
  category?: string | null;
  searchQuery?: string;
  concepts?: string[];
  difficulties?: string[];
}

const ProblemList: React.FC<ProblemListProps> = ({ 
  difficulty, 
  category, 
  searchQuery = '',
  concepts = [],
  difficulties = []
}) => {
  const { user, isAdmin } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [submissionsCount, setSubmissionsCount] = useState<Map<number, number>>(new Map());
  
  useEffect(() => {
    const loadData = async () => {
      // Load problems from MongoDB service
      const loadedProblems = await mongoService.getProblems();
      setProblems(loadedProblems);
      
      // Load submissions for stats if user is admin
      if (isAdmin) {
        const allSubmissions = await mongoService.getSubmissions();
        
        // Count submissions per problem
        const submissionCountMap = new Map<number, number>();
        allSubmissions.forEach((sub: any) => {
          const count = submissionCountMap.get(sub.problemId) || 0;
          submissionCountMap.set(sub.problemId, count + 1);
        });
        
        setSubmissionsCount(submissionCountMap);
      }
      
      // Load solved problems for current user
      if (user) {
        const submissions = await mongoService.getSubmissions();
        // Create a Set of problem IDs that the user has solved
        const solved = new Set<number>(
          submissions
            .filter((s: any) => s.userId === user.id && s.status === 'accepted')
            .map((s: any) => Number(s.problemId))
        );
        setSolvedProblems(solved);
      } else {
        setSolvedProblems(new Set<number>());
      }
    };
    
    loadData();
  }, [user, isAdmin]);
  
  // Filter problems based on props
  const filteredProblems = problems.filter(problem => {
    // Filter by difficulty if specified
    if (difficulty && problem.difficulty !== difficulty) return false;
    
    // Filter by category if specified
    if (category && problem.category !== category) return false;
    
    // Filter by search query
    if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by bioinformatics concepts
    if (concepts && concepts.length > 0) {
      if (!problem.bioinformaticsConcepts) return false;
      if (!concepts.some(concept => problem.bioinformaticsConcepts?.includes(concept))) return false;
    }
    
    // Filter by difficulties array (when coming from the filter panel)
    if (difficulties && difficulties.length > 0) {
      if (!difficulties.includes(problem.difficulty)) return false;
    }
    
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
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Difficulty</div>
        {isAdmin && <div className="col-span-1">Actions</div>}
      </div>
      
      {filteredProblems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No problems found matching the current filters.
        </div>
      ) : (
        <ul>
          {filteredProblems.map((problem) => (
            <li key={problem.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
              <div className="grid grid-cols-12 px-4 py-3 items-center">
                <div className="col-span-1 flex justify-center">
                  {solvedProblems.has(problem.id) ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <Circle className="text-muted-foreground w-5 h-5" />
                  )}
                </div>
                <div className="col-span-6 font-medium">
                  <Link to={`/problem/${problem.slug}`} className="hover:underline">
                    {problem.title}
                  </Link>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {problem.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                <div className={cn("col-span-2 text-sm", getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </div>
                {isAdmin && (
                  <div className="col-span-1 flex gap-2">
                    <Link to={`/admin?tab=problems&view=view&id=${problem.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        <span className="text-xs">{submissionsCount.get(problem.id) || 0}</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemList;
