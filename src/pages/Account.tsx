
import React from 'react';
import { useAuth } from "@/contexts/AuthContext"; // Use AuthContext instead of Clerk
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer>
          <h1 className="text-3xl font-bold mb-6">My Account</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user?.name || 'Not set'}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <p className="text-muted-foreground">Profile editing functionality will be implemented soon.</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Problem Solving Progress</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-4xl font-bold text-primary">3</p>
                      <p className="text-sm text-muted-foreground">Problems Solved</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-4xl font-bold text-green-500">2</p>
                      <p className="text-sm text-muted-foreground">Easy Problems</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-4xl font-bold text-yellow-500">1</p>
                      <p className="text-sm text-muted-foreground">Medium Problems</p>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground text-sm">Keep practicing to improve your skills!</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account settings, including password, email, and notifications.
                </p>
                <div className="mt-4">
                  <p>Account settings functionality will be implemented soon.</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
