
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProblemDetail from "./pages/ProblemDetail";
import Problems from "./pages/Problems";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Algorithms from "./pages/Algorithms";
import DataStructures from "./pages/DataStructures";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:slug" element={<ProblemDetail />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/data-structures" element={<DataStructures />} />
          <Route path="/about" element={<About />} />
          
          {/* Auth routes */}
          <Route path="/login" element={
            <ClerkLoading>
              <div className="h-screen flex items-center justify-center">Loading...</div>
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <Account />
              </SignedIn>
              <SignedOut>
                <Login />
              </SignedOut>
            </ClerkLoaded>
          } />
          <Route path="/signup" element={
            <ClerkLoaded>
              <SignedIn>
                <Account />
              </SignedIn>
              <SignedOut>
                <Signup />
              </SignedOut>
            </ClerkLoaded>
          } />
          <Route path="/account" element={
            <ClerkLoaded>
              <SignedIn>
                <Account />
              </SignedIn>
              <SignedOut>
                <Login />
              </SignedOut>
            </ClerkLoaded>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
