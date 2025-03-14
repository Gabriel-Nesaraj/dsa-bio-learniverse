
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [signupType, setSignupType] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // In a real app, this would be fetched from the server or environment variables
  const validAdminKey = "bioadmin123";

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await signup(name, email, password);
      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        navigate('/');
      } else {
        toast({
          title: "Signup failed",
          description: "Email may already be in use",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (adminKey !== validAdminKey) {
      toast({
        title: "Invalid admin key",
        description: "The admin key you entered is not valid",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a regular user account first
      const success = await signup(name, email, password);
      if (success) {
        // Then update the user to be an admin
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: any) => {
          if (u.email === email) {
            return { ...u, isAdmin: true };
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update the current user in storage to be an admin
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.email === email) {
          currentUser.isAdmin = true;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        toast({
          title: "Admin account created",
          description: "Your admin account has been created successfully",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Signup failed",
          description: "Email may already be in use",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Choose your account type below
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="user" value={signupType} onValueChange={setSignupType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2 justify-center">
                  <UserPlus className="h-4 w-4" />
                  User Signup
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2 justify-center">
                  <Shield className="h-4 w-4" />
                  Admin Signup
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user">
                <CardContent className="pt-6">
                  <form onSubmit={handleUserSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create account'}
                      {!isSubmitting && <UserPlus className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="admin">
                <CardContent className="pt-6">
                  <form onSubmit={handleAdminSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Admin Key"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating admin account...' : 'Create admin account'}
                      {!isSubmitting && <Shield className="ml-2 h-4 w-4" />}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Admin access requires a valid admin key provided by system administrators
                    </p>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
