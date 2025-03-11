
import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <AnimatedContainer className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Sign In to BioDSA</h1>
            <p className="text-muted-foreground mt-2">
              Continue your bioinformatics journey
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                  card: "bg-transparent shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground",
                }
              }}
              redirectUrl="/"
            />
          </div>
        </AnimatedContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
