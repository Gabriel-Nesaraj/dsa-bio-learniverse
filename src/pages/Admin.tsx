import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { PlusCircle, UserCog, FileText, ListChecks, Shield, Eye, Edit } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ProblemEditor from '@/components/admin/ProblemEditor';
import ProblemViewer from '@/components/admin/ProblemViewer';
import mongoService from '@/services/mongoService';
import { useQuery } from '@tanstack/react-query';

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

const adminCreationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  adminKey: z.string().min(1, { message: "Admin key is required." })
});

const Admin = () => {
  const { user, isAdmin, makeUserAdmin, isLoading, updateUserActivity } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems');
  
  const [problemView, setProblemView] = useState<'list' | 'view' | 'edit'>('list');
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  const adminKey = "bioadmin123";
  
  const adminForm = useForm<z.infer<typeof adminCreationSchema>>({
    resolver: zodResolver(adminCreationSchema),
    defaultValues: {
      email: "",
      adminKey: ""
    },
  });
  
  const { data: problems = [], refetch: refetchProblems } = useQuery({
    queryKey: ['problems'],
    queryFn: () => mongoService.getProblems(),
  });
  
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => mongoService.getUsers(),
  });
  
  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => mongoService.getSubmissions(),
  });
  
  useEffect(() => {
    if (user) {
      updateUserActivity();
    }
  }, [user, updateUserActivity]);
  
  useEffect(() => {
    if (!isAdmin && !isLoading) {
      navigate('/');
      toast.error("You don't have permission to access this page");
    }
  }, [isAdmin, isLoading, navigate]);
  
  const selectedProblem = selectedProblemId 
    ? problems.find(p => p.id === selectedProblemId) 
    : null;
  
  const handleAddProblem = () => {
    setSelectedProblemId(null);
    setProblemView('edit');
  };
  
  const handleViewProblem = (id: number) => {
    setSelectedProblemId(id);
    setProblemView('view');
  };
  
  const handleEditProblem = (id: number) => {
    setSelectedProblemId(id);
    setProblemView('edit');
  };
  
  const handleProblemSaved = () => {
    refetchProblems();
    setProblemView('list');
  };
  
  const handleProblemCancel = () => {
    setProblemView('list');
  };
  
  const handleMakeAdmin = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    
    const success = await makeUserAdmin(selectedUser);
    if (success) {
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
    
    const user = users.find(u => u.email === data.email);
    
    if (!user) {
      toast.error("User not found");
      return;
    }
    
    const success = await makeUserAdmin(user.id);
    if (success) {
      toast.success(`${data.email} is now an admin`);
      adminForm.reset();
    } else {
      toast.error("Failed to make user an admin");
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
    return null;
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
            
            <TabsContent value="problems" className="space-y-6">
              {problemView === 'list' && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Problems</h2>
                    <Button onClick={handleAddProblem}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Problem
                    </Button>
                  </div>
              
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
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewProblem(problem.id)}>
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEditProblem(problem.id)}>
                                      <Edit className="w-4 h-4 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
              
              {problemView === 'view' && selectedProblem && (
                <ProblemViewer 
                  problem={selectedProblem} 
                  onBack={handleProblemCancel}
                  onEdit={handleEditProblem}
                />
              )}
              
              {problemView === 'edit' && (
                <ProblemEditor 
                  problemId={selectedProblemId || undefined}
                  onSave={handleProblemSaved}
                  onCancel={handleProblemCancel}
                />
              )}
            </TabsContent>
            
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
