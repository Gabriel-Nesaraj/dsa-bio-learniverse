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
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, Save, Trash, Plus, X } from 'lucide-react';
import mongoService from '@/services/mongoService';
import { Card, CardContent } from "@/components/ui/card";

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
  hints?: string[];
  testCases?: {
    id: number;
    input: string;
    expected: string;
  }[];
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
  starterCodeJs: z.string(),
  hints: z.array(z.object({
    value: z.string()
  })),
  testCases: z.array(z.object({
    input: z.string(),
    expected: z.string()
  }))
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
      starterCodeJs: "function solution(input) {\n  // Your code here\n  return output;\n}",
      hints: [{ value: "" }],
      testCases: [{ input: "", expected: "" }]
    },
  });
  
  const { fields: hintFields, append: appendHint, remove: removeHint } = useFieldArray({
    control: form.control,
    name: "hints"
  });
  
  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase } = useFieldArray({
    control: form.control,
    name: "testCases"
  });
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.title || value.description) {
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
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftJson) {
          try {
            const draft = JSON.parse(draftJson);
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
          
          const foundProblem = await mongoService.getProblemById(problemId);
          console.log("Direct fetch problem result:", foundProblem);
          
          if (foundProblem) {
            setProblem(foundProblem);
            
            const constraintsText = foundProblem.constraints && Array.isArray(foundProblem.constraints) 
              ? foundProblem.constraints.join('\n') 
              : '';
            
            const hintsArray = foundProblem.hints && Array.isArray(foundProblem.hints) 
              ? foundProblem.hints.map((hint: string) => ({ value: hint }))
              : [{ value: "" }];
            
            const testCasesArray = foundProblem.testCases && Array.isArray(foundProblem.testCases) 
              ? foundProblem.testCases.map((tc: any) => ({ 
                  input: tc.input || "", 
                  expected: tc.expected || "" 
                }))
              : [{ input: "", expected: "" }];
            
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
              hints: hintsArray,
              testCases: testCasesArray
            };
            
            form.reset(formValues);
            
            Object.entries(formValues).forEach(([key, value]) => {
              form.setValue(key as any, value);
            });
            
            console.log("After setting, form values are:", form.getValues());
          } else {
            const problems = await mongoService.getProblems();
            console.log("All problems:", problems);
            
            if (!Array.isArray(problems)) {
              console.error("Expected array of problems but got:", typeof problems);
              toast.error("Error loading problems: Invalid data format");
              setIsLoading(false);
              return;
            }
            
            const foundProblemFromList = problems.find(p => String(p.id) === String(problemId));
            console.log("Found problem from list:", foundProblemFromList);
            
            if (foundProblemFromList) {
              setProblem(foundProblemFromList);
              
              const constraintsText = foundProblemFromList.constraints && Array.isArray(foundProblemFromList.constraints) 
                ? foundProblemFromList.constraints.join('\n') 
                : '';
              
              const hintsArray = foundProblemFromList.hints && Array.isArray(foundProblemFromList.hints) 
                ? foundProblemFromList.hints.map((hint: string) => ({ value: hint }))
                : [{ value: "" }];
              
              const testCasesArray = foundProblemFromList.testCases && Array.isArray(foundProblemFromList.testCases) 
                ? foundProblemFromList.testCases.map((tc: any) => ({ 
                    input: tc.input || "", 
                    expected: tc.expected || "" 
                  }))
                : [{ input: "", expected: "" }];
              
              const formValues = {
                title: foundProblemFromList.title || '',
                difficulty: foundProblemFromList.difficulty || 'medium',
                category: foundProblemFromList.category || 'dynamic-programming',
                description: foundProblemFromList.description || '',
                exampleInput: foundProblemFromList.examples && foundProblemFromList.examples[0] ? foundProblemFromList.examples[0].input || '' : '',
                exampleOutput: foundProblemFromList.examples && foundProblemFromList.examples[0] ? foundProblemFromList.examples[0].output || '' : '',
                exampleExplanation: foundProblemFromList.examples && foundProblemFromList.examples[0] && foundProblemFromList.examples[0].explanation ? foundProblemFromList.examples[0].explanation : '',
                constraints: constraintsText,
                starterCodeJs: foundProblemFromList.starterCode && foundProblemFromList.starterCode.javascript ? foundProblemFromList.starterCode.javascript : '',
                hints: hintsArray,
                testCases: testCasesArray
              };
              
              form.reset(formValues);
              
              Object.entries(formValues).forEach(([key, value]) => {
                form.setValue(key as any, value);
              });
            } else {
              console.error("Problem not found with ID:", problemId);
              toast.error("Problem not found");
            }
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
        
        const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftJson) {
          try {
            const draft = JSON.parse(draftJson);
            if (!draft.problemId) {
              form.reset(draft.formData);
              setHasDraft(true);
              console.log("Loaded draft for new problem");
              return;
            }
          } catch (e) {
            console.error("Error parsing draft data", e);
          }
        }
        
        form.reset({
          title: "",
          difficulty: "medium",
          category: "dynamic-programming",
          description: "",
          exampleInput: "",
          exampleOutput: "",
          exampleExplanation: "",
          constraints: "",
          starterCodeJs: "function solution(input) {\n  // Your code here\n  return output;\n}",
          hints: [{ value: "" }],
          testCases: [{ input: "", expected: "" }]
        });
      }
    };
    
    loadProblem();
  }, [problemId, form]);
  
  useEffect(() => {
    console.log("Current form values:", form.getValues());
  }, [form]);
  
  const handleSubmit = async (data: z.infer<typeof problemSchema>) => {
    console.log("Submitting form with data:", data);
    setIsLoading(true);
    
    try {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      
      const constraintsArray = data.constraints
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const hintsArray = data.hints
        .map(hint => hint.value.trim())
        .filter(hint => hint.length > 0);
      
      const testCasesArray = data.testCases
        .filter(tc => tc.input.trim().length > 0 || tc.expected.trim().length > 0)
        .map((tc, index) => ({
          id: index + 1,
          input: tc.input.trim(),
          expected: tc.expected.trim()
        }));
      
      if (isNewProblem) {
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
          starterCode: { javascript: data.starterCodeJs },
          hints: hintsArray.length > 0 ? hintsArray : undefined,
          testCases: testCasesArray.length > 0 ? testCasesArray : undefined
        };
        
        await mongoService.createProblem(newProblem);
        toast.success("Problem added successfully!");
      } else {
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
            },
            hints: hintsArray.length > 0 ? hintsArray : undefined,
            testCases: testCasesArray.length > 0 ? testCasesArray : undefined
          };
          
          await mongoService.updateProblem(problemId!, updatedProblem);
          toast.success("Problem updated successfully!");
        } else {
          toast.error("Problem not found");
        }
      }
      
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      
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
    
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    
    onCancel();
  };
  
  const discardDraft = () => {
    if (window.confirm("Are you sure you want to discard your draft?")) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      
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
        form.reset({
          title: "",
          difficulty: "medium",
          category: "dynamic-programming",
          description: "",
          exampleInput: "",
          exampleOutput: "",
          exampleExplanation: "",
          constraints: "",
          starterCodeJs: "function solution(input) {\n  // Your code here\n  return output;\n}",
          hints: [{ value: "" }],
          testCases: [{ input: "", expected: "" }]
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
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Hints</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendHint({ value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hint
                </Button>
              </div>
              
              {hintFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`hints.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder={`Hint ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHint(index)}
                    className="self-start mt-1"
                    disabled={hintFields.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Test Cases</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestCase({ input: "", expected: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              </div>
              
              {testCaseFields.map((field, index) => (
                <Card key={field.id} className="p-0 overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Test Case {index + 1}</h4>
                      {testCaseFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestCase(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`testCases.${index}.input`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Input</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Test case input"
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
                      name={`testCases.${index}.expected`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Output</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Expected result"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            
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
