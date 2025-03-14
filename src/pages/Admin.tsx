
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { PlusCircle, UserCog, FileText, ListChecks, Shield } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define types for our problems
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

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
};

type Submission = {
  id: string;
  userId: string;
  problemId: number;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error';
  timestamp: number;
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

// Schema for admin creation form
const adminCreationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  adminKey: z.string().min(1, { message: "Admin key is required." })
});

const Admin = () => {
  const { user, isAdmin, makeUserAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems');
  
  // For problem management
  const [problems, setProblems] = useState<Problem[]>([]);
  
  // For user management
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  // For submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // For admin key (in real app, this would be environment variable)
  const adminKey = "bioadmin123"; // Example only - in production use a secure value
  
  // Problem form
  const problemForm = useForm<z.infer<typeof problemSchema>>({
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

  // Admin creation form
  const adminForm = useForm<z.infer<typeof adminCreationSchema>>({
    resolver: zodResolver(adminCreationSchema),
    defaultValues: {
      email: "",
      adminKey: ""
    },
  });
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin && !isLoading) {
      navigate('/');
      toast.error("You don't have permission to access this page");
    }
    
    // Load problems from localStorage
    const storedProblems = localStorage.getItem('problems');
    if (storedProblems) {
      setProblems(JSON.parse(storedProblems));
    }
    
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers).map((u: any) => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
      setUsers(parsedUsers);
    }
    
    // Load submissions from localStorage
    const storedSubmissions = localStorage.getItem('submissions');
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    }
  }, [isAdmin, isLoading, navigate]);
  
  const handleAddProblem = (data: z.infer<typeof problemSchema>) => {
    // Generate slug from title
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Generate ID (normally this would be handled by a backend)
    const id = problems.length > 0 ? Math.max(...problems.map(p => p.id)) + 1 : 1;
    
    // Parse constraints into array
    const constraintsArray = data.constraints
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const problem: Problem = {
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
    
    const updatedProblems = [...problems, problem];
    setProblems(updatedProblems);
    localStorage.setItem('problems', JSON.stringify(updatedProblems));
    
    // Reset form
    problemForm.reset();
    
    toast.success("Problem added successfully!");
  };
  
  const handleMakeAdmin = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    
    const success = await makeUserAdmin(selectedUser);
    if (success) {
      // Update local users state
      const updatedUsers = users.map(u => {
        if (u.id === selectedUser) {
          return { ...u, isAdmin: true };
        }
        return u;
      });
      setUsers(updatedUsers);
      
      toast.success("User is now an admin");
      setSelectedUser('');
    } else {
      toast.error("Failed to make user an admin");
    }
  };
  
  const handleMakeAdminWithKey = async (data: z.infer<typeof adminCreationSchema>) => {
    if (data.adminKey !== adminKey) {
      toast.error("Invalid admin key");
      return;
    }
    
    // Find user by email
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === data.email);
    
    if (!user) {
      toast.error("User not found");
      return;
    }
    
    // Update user to admin in localStorage
    const updatedUsers = users.map((u: any) => {
      if (u.email === data.email) {
        return { ...u, isAdmin: true };
      }
      return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Refresh users list
    const parsedUsers = updatedUsers.map((u: any) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    setUsers(parsedUsers);
    
    toast.success(`${data.email} is now an admin`);
    adminForm.reset();
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
    return null; // This will prevent flickering before redirect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Manage problems, users, and view submissions
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="problems" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Problems
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Submissions
              </TabsTrigger>
            </TabsList>
            
            {/* Problems Tab */}
            <TabsContent value="problems" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Problem</CardTitle>
                  <CardDescription>
                    Create a new bioinformatics problem for users to solve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...problemForm}>
                    <form onSubmit={problemForm.handleSubmit(handleAddProblem)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={problemForm.control}
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
                            control={problemForm.control}
                            name="difficulty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Difficulty</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
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
                            control={problemForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
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
                        control={problemForm.control}
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
                        control={problemForm.control}
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
                        control={problemForm.control}
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
                        control={problemForm.control}
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
                        control={problemForm.control}
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
                        control={problemForm.control}
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
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Problem
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Existing Problems</CardTitle>
                  <CardDescription>
                    Manage your existing bioinformatics problems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {problems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No problems added yet
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {problems.map((problem) => (
                          <TableRow key={problem.id}>
                            <TableCell>{problem.id}</TableCell>
                            <TableCell>{problem.title}</TableCell>
                            <TableCell className={
                              problem.difficulty === 'easy' ? 'text-green-500' : 
                              problem.difficulty === 'medium' ? 'text-yellow-600' : 
                              'text-red-500'
                            }>
                              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                            </TableCell>
                            <TableCell>
                              {problem.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/problem/${problem.slug}`} target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grant Admin Access</CardTitle>
                  <CardDescription>
                    Give admin privileges to other users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Select Existing User</h3>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(u => !u.isAdmin)
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      
                      <Button onClick={handleMakeAdmin} disabled={!selectedUser} className="w-full">
                        <UserCog className="w-4 h-4 mr-2" />
                        Make Admin
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Admin Access by Email</h3>
                      <Form {...adminForm}>
                        <form onSubmit={adminForm.handleSubmit(handleMakeAdminWithKey)} className="space-y-4">
                          <FormField
                            control={adminForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>User Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={adminForm.control}
                            name="adminKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Admin Key</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter admin key" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This key is provided by system administrators
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full">
                            <Shield className="w-4 h-4 mr-2" />
                            Grant Admin Access
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    View and manage all registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users registered yet
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className={user.isAdmin ? 'text-primary font-medium' : ''}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {user.id}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Submissions</CardTitle>
                  <CardDescription>
                    View all user submissions across problems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No submissions yet
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Problem</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => {
                          const submissionUser = users.find(u => u.id === submission.userId);
                          const problem = problems.find(p => p.id === submission.problemId);
                          
                          return (
                            <TableRow key={submission.id}>
                              <TableCell>{submissionUser?.name || 'Unknown'}</TableCell>
                              <TableCell>{problem?.title || 'Unknown'}</TableCell>
                              <TableCell>{submission.language}</TableCell>
                              <TableCell className={
                                submission.status === 'accepted' ? 'text-green-500' : 
                                'text-red-500'
                              }>
                                {submission.status.replace('_', ' ').split(' ').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </TableCell>
                              <TableCell>{new Date(submission.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
