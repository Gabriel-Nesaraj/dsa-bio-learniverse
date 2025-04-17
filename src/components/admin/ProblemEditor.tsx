
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

const DRAFT_STORAGE_KEY = 'problem-editor-draft';

const ProblemEditor: React.FC<ProblemEditorProps> = ({ problemId, onSave, onCancel }) => {
  const [isNewProblem, setIsNewProblem] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  
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
  
  // Save form state to localStorage whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.title || value.description) {
        // Only save non-empty drafts
        const draftData = {
          formData: value,
          problemId,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        setHasDraft(true);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, problemId]);
  
  // Check for beforeunload event to warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form.formState.isDirty]);
  
  // Handle visibility change to restore state when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if we need to restore from draft
        const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftJson) {
          try {
            const draft = JSON.parse(draftJson);
            // Only restore if it's for the same problem
            if (draft.problemId === problemId) {
              form.reset(draft.formData);
              setHasDraft(true);
              console.log("Restored draft from localStorage");
            }
          } catch (e) {
            console.error("Error parsing draft data", e);
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [form, problemId]);
  
  useEffect(() => {
    console.log("ProblemEditor mounted with problemId:", problemId);
    
    const loadProblem = async () => {
      if (problemId) {
        setIsLoading(true);
        setIsNewProblem(false);
        
        try {
          console.log("Loading problem with ID:", problemId);
          
          // Fetch problem directly from MongoDB service
          const problems = await mongoService.getProblems();
          console.log("All problems:", problems);
          
          if (!Array.isArray(problems)) {
            console.error("Expected array of problems but got:", typeof problems);
            toast.error("Error loading problems: Invalid data format");
            setIsLoading(false);
            return;
          }
          
          // Find the problem with matching ID
          const foundProblem = problems.find(p => p.id === problemId);
          console.log("Found problem:", foundProblem);
          
          if (foundProblem) {
            setProblem(foundProblem);
            
            // Process constraints array to string
            const constraintsText = foundProblem.constraints && Array.isArray(foundProblem.constraints) 
              ? foundProblem.constraints.join('\n') 
              : '';
            
            // Check if we have a draft first
            const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (draftJson) {
              try {
                const draft = JSON.parse(draftJson);
                // Only use draft if it's for this problem
                if (draft.problemId === problemId) {
                  form.reset(draft.formData);
                  setHasDraft(true);
                  console.log("Loaded draft for problemId:", problemId);
                  setIsLoading(false);
                  return; // Skip loading from server data
                }
              } catch (e) {
                console.error("Error parsing draft data", e);
              }
            }
            
            // If no usable draft, load from server data
            const formValues = {
              title: foundProblem.title || '',
              difficulty: foundProblem.difficulty || 'medium',
              category: foundProblem.category || 'dynamic-programming',
              description: foundProblem.description || '',
              exampleInput: foundProblem.examples && foundProblem.examples[0] ? foundProblem.examples[0].input || '' : '',
              exampleOutput: foundProblem.examples && foundProblem.examples[0] ? foundProblem.examples[0].output || '' : '',
              exampleExplanation: foundProblem.examples && foundProblem.examples[0] && foundProblem.examples[0].explanation ? foundProblem.examples[0].explanation : '',
              constraints: constraintsText,
              starterCodeJs: foundProblem.starterCode && foundProblem.starterCode.javascript ? foundProblem.starterCode.javascript : '',
            };
            
            console.log("Setting form values:", formValues);
            
            // Reset the form with the values
            form.reset(formValues);
            
            // Force set values to ensure they're properly applied
            Object.entries(formValues).forEach(([key, value]) => {
              form.setValue(key as any, value);
            });
            
            console.log("After setting, form values are:", form.getValues());
          } else {
            console.error("Problem not found with ID:", problemId);
            toast.error("Problem not found");
          }
        } catch (error) {
          console.error("Error loading problem:", error);
          toast.error("Error loading problem: " + (error instanceof Error ? error.message : String(error)));
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Creating new problem");
        setIsNewProblem(true);
        
        // Check if there's a draft for a new problem
        const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftJson) {
          try {
            const draft = JSON.parse(draftJson);
            // Only use draft if it's for a new problem (no problemId)
            if (!draft.problemId) {
              form.reset(draft.formData);
              setHasDraft(true);
              console.log("Loaded draft for new problem");
              return; // Skip loading defaults
            }
          } catch (e) {
            console.error("Error parsing draft data", e);
          }
        }
        
        // If no usable draft, use defaults
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

  // Debug log to show current form values
  useEffect(() => {
    console.log("Current form values:", form.getValues());
  }, [form]);
  
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
        if (problem) {
          const updatedProblem = {
            ...problem,
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
              ...problem.starterCode,
              javascript: data.starterCodeJs 
            }
          };
          
          await mongoService.updateProblem(problemId!, updatedProblem);
          toast.success("Problem updated successfully!");
        } else {
          toast.error("Problem not found");
        }
      }
      
      // Clear the draft after successful save
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      
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
        
        // Clear any drafts related to this problem
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasDraft(false);
        
        onCancel();
      } catch (error) {
        console.error("Error deleting problem:", error);
        toast.error("Error deleting problem");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleCancel = () => {
    if (form.formState.isDirty && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
      return;
    }
    
    // Clear the draft when explicitly canceling
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    
    onCancel();
  };
  
  const discardDraft = () => {
    if (window.confirm("Are you sure you want to discard your draft?")) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      
      // Reload the problem data
      if (problemId && problem) {
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
        // Reset to defaults for new problem
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
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{isNewProblem ? 'Add New Problem' : 'Edit Problem'}</h2>
        <div className="flex gap-2">
          {hasDraft && (
            <div className="flex items-center">
              <span className="text-amber-600 text-sm mr-2">
                Unsaved draft
              </span>
              <Button variant="outline" size="sm" onClick={discardDraft}>
                Discard draft
              </Button>
            </div>
          )}
          {!isNewProblem && (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
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
