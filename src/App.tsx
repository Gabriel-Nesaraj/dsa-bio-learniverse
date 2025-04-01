
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KeycloakProvider } from "@/contexts/KeycloakContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProblemDetail from "./pages/ProblemDetail";
import Problems from "./pages/Problems";
import Algorithms from "./pages/Algorithms";
import DataStructures from "./pages/DataStructures";
import DataStructureDetail from "./pages/DataStructureDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  // For debugging
  console.log("App rendering, routes initialized");
  
  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problem/:slug" element={<ProblemDetail />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/data-structures" element={<DataStructures />} />
              <Route path="/data-structures/:category" element={<DataStructureDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </KeycloakProvider>
    </QueryClientProvider>
  );
};

export default App;
