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
import mongoService from '@/services/mongoService';

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
  const [isLoading, setIsLoading] = useState(false);
  
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
    const loadProblem = async () => {
      if (problemId) {
        setIsLoading(true);
        setIsNewProblem(false);
        
        try {
          // Use mongoService to get all problems first
          const allProblems = await mongoService.getProblems();
          const problem = allProblems.find((p: Problem) => p.id === problemId);
          
          if (problem) {
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
            toast.error("Problem not found");
          }
        } catch (error) {
          console.error("Error loading problem:", error);
          toast.error("Error loading problem");
        } finally {
          setIsLoading(false);
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
    };
    
    loadProblem();
  }, [problemId, form]);
  
  const handleSubmit = async (data: z.infer<typeof problemSchema>) => {
    console.log("Submitting form with data:", data);
    setIsLoading(true);
    
    try {
      // Generate slug from title
      const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      
      // Parse constraints into array
      const constraintsArray = data.constraints
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (isNewProblem) {
        // Load existing problems to generate ID
        const problems = await mongoService.getProblems();
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
        
        await mongoService.createProblem(newProblem);
        toast.success("Problem added successfully!");
      } else {
        // Update existing problem
        const problems = await mongoService.getProblems();
        const currentProblem = problems.find((p: Problem) => p.id === problemId);
        
        if (currentProblem) {
          const updatedProblem = {
            ...currentProblem,
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
              ...currentProblem.starterCode,
              javascript: data.starterCodeJs 
            }
          };
          
          await mongoService.updateProblem(problemId!, updatedProblem);
          toast.success("Problem updated successfully!");
        } else {
          toast.error("Problem not found");
        }
      }
      
      // Reset form and notify parent component
      form.reset();
      onSave();
    } catch (error) {
      console.error("Error saving problem:", error);
      toast.error("Error saving problem");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!problemId || isNewProblem) return;
    
    if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      setIsLoading(true);
      
      try {
        await mongoService.deleteProblem(problemId);
        toast.success("Problem deleted successfully!");
        onCancel();
      } catch (error) {
        console.error("Error deleting problem:", error);
        toast.error("Error deleting problem");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{isNewProblem ? 'Add New Problem' : 'Edit Problem'}</h2>
        <div className="flex gap-2">
          {!isNewProblem && (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
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
      )}
    </div>
  );
};

export default ProblemEditor;
