
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
import { PlusCircle, UserCog, FileText, ListChecks, Filter } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const Admin = () => {
  const { user, isAdmin, makeUserAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems');
  
  // For problem management
  const [problems, setProblems] = useState<Problem[]>([]);
  const [newProblem, setNewProblem] = useState<Partial<Problem>>({
    title: '',
    difficulty: 'medium',
    category: 'dynamic-programming',
    description: '',
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: [''],
    starterCode: { javascript: '' }
  });
  
  // For user management
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  // For submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
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
  }, [isAdmin, navigate]);
  
  const handleAddProblem = () => {
    // Generate slug from title
    const slug = newProblem.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '';
    
    // Generate ID (normally this would be handled by a backend)
    const id = problems.length > 0 ? Math.max(...problems.map(p => p.id)) + 1 : 1;
    
    const problem: Problem = {
      id,
      title: newProblem.title || '',
      slug,
      difficulty: newProblem.difficulty as Difficulty || 'medium',
      category: newProblem.category || '',
      description: newProblem.description || '',
      examples: newProblem.examples || [],
      constraints: newProblem.constraints || [],
      starterCode: newProblem.starterCode || { javascript: '' }
    };
    
    const updatedProblems = [...problems, problem];
    setProblems(updatedProblems);
    localStorage.setItem('problems', JSON.stringify(updatedProblems));
    
    // Reset form
    setNewProblem({
      title: '',
      difficulty: 'medium',
      category: 'dynamic-programming',
      description: '',
      examples: [{ input: '', output: '', explanation: '' }],
      constraints: [''],
      starterCode: { javascript: '' }
    });
    
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
  
  const { isLoading } = useAuth();
  
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
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input 
                          placeholder="Problem title" 
                          value={newProblem.title}
                          onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Difficulty</label>
                          <Select 
                            value={newProblem.difficulty}
                            onValueChange={(value) => setNewProblem({...newProblem, difficulty: value as Difficulty})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Category</label>
                          <Select 
                            value={newProblem.category}
                            onValueChange={(value) => setNewProblem({...newProblem, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="graph-algorithms">Graph Algorithms</SelectItem>
                              <SelectItem value="tree-data-structures">Tree Data Structures</SelectItem>
                              <SelectItem value="search-algorithms">Search Algorithms</SelectItem>
                              <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                              <SelectItem value="machine-learning">Machine Learning</SelectItem>
                              <SelectItem value="combinatorial-algorithms">Combinatorial Algorithms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea 
                        placeholder="Problem description" 
                        rows={5}
                        value={newProblem.description}
                        onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Example Input</label>
                      <Textarea 
                        placeholder="Example input" 
                        rows={2}
                        value={newProblem.examples?.[0]?.input || ''}
                        onChange={(e) => {
                          const examples = [...(newProblem.examples || [])];
                          if (examples.length === 0) {
                            examples.push({ input: e.target.value, output: '' });
                          } else {
                            examples[0] = { ...examples[0], input: e.target.value };
                          }
                          setNewProblem({...newProblem, examples});
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Example Output</label>
                      <Textarea 
                        placeholder="Example output" 
                        rows={2}
                        value={newProblem.examples?.[0]?.output || ''}
                        onChange={(e) => {
                          const examples = [...(newProblem.examples || [])];
                          if (examples.length === 0) {
                            examples.push({ input: '', output: e.target.value });
                          } else {
                            examples[0] = { ...examples[0], output: e.target.value };
                          }
                          setNewProblem({...newProblem, examples});
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Starter Code (JavaScript)</label>
                      <Textarea 
                        placeholder="function solution() { ... }" 
                        rows={6}
                        className="font-mono text-sm"
                        value={newProblem.starterCode?.javascript || ''}
                        onChange={(e) => {
                          setNewProblem({
                            ...newProblem, 
                            starterCode: { 
                              ...(newProblem.starterCode || {}), 
                              javascript: e.target.value 
                            }
                          });
                        }}
                      />
                    </div>
                    
                    <Button onClick={handleAddProblem} className="w-full">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Problem
                    </Button>
                  </div>
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
                  <div className="space-y-4">
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
                    
                    <Button onClick={handleMakeAdmin} disabled={!selectedUser}>
                      <UserCog className="w-4 h-4 mr-2" />
                      Make Admin
                    </Button>
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
                          <TableHead>Admin Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
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
