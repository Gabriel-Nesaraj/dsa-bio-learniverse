import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User, Code, Activity, Clock, CheckCircle } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { BarChart } from '@/components/ui/bar-chart';
import { Progress } from '@/components/ui/progress';

type Submission = {
  id: string;
  userId: string;
  problemId: number;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error';
  timestamp: number;
};

type Problem = {
  id: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
};

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
    
    const storedSubmissions = localStorage.getItem('submissions');
    if (storedSubmissions) {
      const allSubmissions = JSON.parse(storedSubmissions);
      const userSubmissions = user ? allSubmissions.filter((s: Submission) => s.userId === user.id) : [];
      setSubmissions(userSubmissions);
    }
    
    const storedProblems = localStorage.getItem('problems');
    if (storedProblems) {
      setProblems(JSON.parse(storedProblems));
    }
  }, [user, isLoading, navigate]);
  
  const solvedProblems = submissions
    .filter(s => s.status === 'accepted')
    .reduce((acc: Set<number>, submission) => {
      acc.add(submission.problemId);
      return acc;
    }, new Set<number>());
  
  const totalProblems = problems.length;
  const solvedCount = solvedProblems.size;
  const solvedEasy = problems.filter(p => p.difficulty === 'easy' && solvedProblems.has(p.id)).length;
  const solvedMedium = problems.filter(p => p.difficulty === 'medium' && solvedProblems.has(p.id)).length;
  const solvedHard = problems.filter(p => p.difficulty === 'hard' && solvedProblems.has(p.id)).length;
  
  const totalEasy = problems.filter(p => p.difficulty === 'easy').length;
  const totalMedium = problems.filter(p => p.difficulty === 'medium').length;
  const totalHard = problems.filter(p => p.difficulty === 'hard').length;
  
  const chartData = [
    {
      name: 'Easy',
      solved: solvedEasy,
      total: totalEasy,
    },
    {
      name: 'Medium',
      solved: solvedMedium,
      total: totalMedium,
    },
    {
      name: 'Hard',
      solved: solvedHard,
      total: totalHard,
    },
  ];
  
  const submissionsByDay = submissions.reduce((acc: Record<string, number>, submission) => {
    const date = new Date(submission.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const mostActiveDay = Object.entries(submissionsByDay).sort((a, b) => b[1] - a[1])[0];
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null; // This will prevent flickering before redirect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-muted-foreground">
                Track your progress and view your submissions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" asChild>
                <a href="/problems">
                  Solve More Problems
                </a>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Problems Solved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{solvedCount}</div>
                  <div className="text-sm text-muted-foreground">of {totalProblems} total</div>
                </div>
                <div className="mt-4">
                  <Progress value={totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Submission Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">
                    {submissions.length > 0 
                      ? `${Math.round((submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {submissions.filter(s => s.status === 'accepted').length} of {submissions.length} submissions
                  </div>
                </div>
                <div className="mt-4">
                  <Progress 
                    value={submissions.length > 0 
                      ? (submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100 
                      : 0
                    } 
                    className="h-2 bg-gray-200" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Most Active Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">
                    {mostActiveDay ? mostActiveDay[1] : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mostActiveDay ? `submissions on ${mostActiveDay[0]}` : 'submissions'}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Keep your streak going by solving problems daily!
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Solving Progress</CardTitle>
                <CardDescription>
                  Your progress across different difficulty levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={chartData}
                    xKey="name"
                    yKey="solved"
                    colors={["#10b981"]}
                    height={300}
                    showGrid={true}
                    showTooltip={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <User className="w-10 h-10 text-primary p-2 bg-primary/10 rounded-full" />
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Stats</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Problems Solved
                        </span>
                        <span>{solvedCount}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-blue-500" />
                          Total Submissions
                        </span>
                        <span>{submissions.length}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-yellow-500" />
                          Success Rate
                        </span>
                        <span>
                          {submissions.length > 0 
                            ? `${Math.round((submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100)}%` 
                            : '0%'}
                        </span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          Last Submission
                        </span>
                        <span>
                          {submissions.length > 0 
                            ? new Date(Math.max(...submissions.map(s => s.timestamp))).toLocaleDateString() 
                            : 'None'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Submissions</CardTitle>
              <CardDescription>
                Recent code submissions across all problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't submitted any solutions yet. Start solving problems!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Problem</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((submission) => {
                        const problem = problems.find(p => p.id === submission.problemId);
                        
                        return (
                          <TableRow key={submission.id}>
                            <TableCell>
                              {problem ? problem.title : 'Unknown Problem'}
                            </TableCell>
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
                            <TableCell>
                              {problem && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/problem/${problem.slug}`}>
                                    Try Again
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
