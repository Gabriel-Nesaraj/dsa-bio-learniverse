
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KeycloakProvider } from "@/contexts/KeycloakContext";
import { AuthProvider } from "@/contexts/AuthContext"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProblemDetail from "./pages/ProblemDetail";
import Problems from "./pages/Problems";
import Algorithms from "./pages/Algorithms";
import AlgorithmCategory from "./pages/AlgorithmCategory"; // Import the new component
import DataStructures from "./pages/DataStructures";
import DataStructureDetail from "./pages/DataStructureDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Account from "./pages/Account";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  // For debugging
  console.log("App rendering, routes initialized");
  
  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problem/:slug" element={<ProblemDetail />} />
                <Route path="/algorithms" element={<Algorithms />} />
                <Route path="/algorithms/:category" element={<AlgorithmCategory />} /> {/* Add route for algorithm categories */}
                <Route path="/data-structures" element={<DataStructures />} />
                <Route path="/data-structures/:category" element={<DataStructureDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account" element={<Account />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </KeycloakProvider>
    </QueryClientProvider>
  );
};

export default App;
