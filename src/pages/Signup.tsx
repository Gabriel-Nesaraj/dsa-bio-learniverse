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
  const [signupType, setSignupType] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, upgradeToAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    setIsSubmitting(true);
    
    try {
      // First, check if the user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        console.log('Found existing user, attempting to upgrade to admin', { email });
        
        // Try to upgrade the existing account to admin
        const success = await upgradeToAdmin(email, password);
        
        if (success) {
          console.log('Successfully upgraded user to admin', { email });
          toast({
            title: "Account upgraded to admin",
            description: "Your existing account now has admin privileges",
          });
          navigate('/admin');
        } else {
          console.log('Failed to upgrade user to admin', { email });
          toast({
            title: "Upgrade failed",
            description: "Could not upgrade your account. Please check your password.",
            variant: "destructive",
          });
        }
      } else {
        console.log('Creating new admin user', { email });
        
        // Create a new user with admin privileges
        const success = await signup(name, email, password);
        
        if (success) {
          console.log('User created, now making admin', { email });
          
          // Update the users array with admin privilege
          const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const userToUpdate = updatedUsers.find((u: any) => u.email === email);
          
          if (userToUpdate) {
            userToUpdate.isAdmin = true;
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
            console.error('User was created but not found in localStorage');
            toast({
              title: "Account creation issue",
              description: "Your account was created but admin privileges could not be applied",
              variant: "destructive",
            });
          }
        } else {
          console.log('Failed to create new user', { email });
          toast({
            title: "Signup failed",
            description: "Email may already be in use",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error during admin signup:', error);
      toast({
        title: "Signup error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating admin account...' : 'Create admin account'}
                      {!isSubmitting && <Shield className="ml-2 h-4 w-4" />}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Admin accounts have special privileges to manage problems and users
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
