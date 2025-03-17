
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, Save, Trash } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

type Problem = {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  examples: { 
    input: string; 
    output: string; 
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<string, string>;
};

// Schema for problem form validation
const problemSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  exampleInput: z.string(),
  exampleOutput: z.string(),
  exampleExplanation: z.string().optional(),
  constraints: z.string(),
  starterCodeJs: z.string()
});

interface ProblemEditorProps {
  problemId?: number;
  onSave: () => void;
  onCancel: () => void;
}

const ProblemEditor: React.FC<ProblemEditorProps> = ({ problemId, onSave, onCancel }) => {
  const [isNewProblem, setIsNewProblem] = useState(true);
  
  const form = useForm<z.infer<typeof problemSchema>>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      difficulty: "medium",
      category: "dynamic-programming",
      description: "",
      exampleInput: "",
      exampleOutput: "",
      exampleExplanation: "",
      constraints: "",
      starterCodeJs: "function solution(input) {\n  // Your code here\n  return output;\n}"
    },
  });
  
  useEffect(() => {
    if (problemId) {
      setIsNewProblem(false);
      
      // Load problem data
      const storedProblems = localStorage.getItem('problems');
      if (storedProblems) {
        const problems = JSON.parse(storedProblems);
        const problem = problems.find((p: Problem) => p.id === problemId);
        
        if (problem) {
          // Add console.log for debugging
          console.log("Found problem for editing:", problem);
          
          // Safely process constraints - handle if they're undefined
          const constraintsText = problem.constraints && Array.isArray(problem.constraints) 
            ? problem.constraints.join('\n') 
            : '';
          
          form.reset({
            title: problem.title || '',
            difficulty: problem.difficulty || 'medium',
            category: problem.category || 'dynamic-programming',
            description: problem.description || '',
            exampleInput: problem.examples && problem.examples[0] ? problem.examples[0].input || '' : '',
            exampleOutput: problem.examples && problem.examples[0] ? problem.examples[0].output || '' : '',
            exampleExplanation: problem.examples && problem.examples[0] && problem.examples[0].explanation ? problem.examples[0].explanation : '',
            constraints: constraintsText,
            starterCodeJs: problem.starterCode && problem.starterCode.javascript ? problem.starterCode.javascript : ''
          });
        } else {
          console.log("Problem not found with ID:", problemId);
        }
      }
    } else {
      setIsNewProblem(true);
      form.reset({
        title: "",
        difficulty: "medium",
        category: "dynamic-programming",
        description: "",
        exampleInput: "",
        exampleOutput: "",
        exampleExplanation: "",
        constraints: "",
        starterCodeJs: "function solution(input) {\n  // Your code here\n  return output;\n}"
      });
    }
  }, [problemId, form]);
  
  const handleSubmit = (data: z.infer<typeof problemSchema>) => {
    console.log("Submitting form with data:", data);
    
    // Generate slug from title
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Parse constraints into array
    const constraintsArray = data.constraints
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Load existing problems
    const storedProblems = localStorage.getItem('problems');
    const problems = storedProblems ? JSON.parse(storedProblems) : [];
    
    if (isNewProblem) {
      // Generate ID for new problem
      const id = problems.length > 0 ? Math.max(...problems.map((p: Problem) => p.id)) + 1 : 1;
      
      const newProblem: Problem = {
        id,
        title: data.title,
        slug,
        difficulty: data.difficulty as Difficulty,
        category: data.category,
        description: data.description,
        examples: [{
          input: data.exampleInput,
          output: data.exampleOutput,
          explanation: data.exampleExplanation
        }],
        constraints: constraintsArray,
        starterCode: { javascript: data.starterCodeJs }
      };
      
      const updatedProblems = [...problems, newProblem];
      localStorage.setItem('problems', JSON.stringify(updatedProblems));
      toast.success("Problem added successfully!");
    } else {
      // Update existing problem
      const updatedProblems = problems.map((p: Problem) => {
        if (p.id === problemId) {
          return {
            ...p,
            title: data.title,
            slug,
            difficulty: data.difficulty as Difficulty,
            category: data.category,
            description: data.description,
            examples: [{
              input: data.exampleInput,
              output: data.exampleOutput,
              explanation: data.exampleExplanation
            }],
            constraints: constraintsArray,
            starterCode: { 
              ...p.starterCode,
              javascript: data.starterCodeJs 
            }
          };
        }
        return p;
      });
      
      localStorage.setItem('problems', JSON.stringify(updatedProblems));
      toast.success("Problem updated successfully!");
    }
    
    // Reset form and notify parent component
    form.reset();
    onSave();
  };
  
  const handleDelete = () => {
    if (!problemId || isNewProblem) return;
    
    if (confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      const storedProblems = localStorage.getItem('problems');
      if (storedProblems) {
        const problems = JSON.parse(storedProblems);
        const updatedProblems = problems.filter((p: Problem) => p.id !== problemId);
        localStorage.setItem('problems', JSON.stringify(updatedProblems));
        
        toast.success("Problem deleted successfully!");
        onCancel();
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{isNewProblem ? 'Add New Problem' : 'Edit Problem'}</h2>
        <div className="flex gap-2">
          {!isNewProblem && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Problem title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="graph-algorithms">Graph Algorithms</SelectItem>
                        <SelectItem value="tree-data-structures">Tree Data Structures</SelectItem>
                        <SelectItem value="search-algorithms">Search Algorithms</SelectItem>
                        <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                        <SelectItem value="machine-learning">Machine Learning</SelectItem>
                        <SelectItem value="combinatorial-algorithms">Combinatorial Algorithms</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Problem description" 
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of the problem including background information
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exampleInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Input</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Example input" 
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exampleOutput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Output</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Example output" 
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exampleExplanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Explanation (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explanation of the example" 
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="constraints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Constraints</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="One constraint per line" 
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter each constraint on a new line
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="starterCodeJs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starter Code (JavaScript)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="function solution() { ... }" 
                    rows={6}
                    className="font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            {isNewProblem ? (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Problem
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProblemEditor;
