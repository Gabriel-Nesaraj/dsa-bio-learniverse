
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedContainer from "@/components/ui/AnimatedContainer";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container px-4 py-20 mx-auto">
          <AnimatedContainer className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <FileQuestion className="w-8 h-8" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Oops! This page seems to have mutated and disappeared.
            </p>
            
            <Link to="/">
              <Button size="lg">Return to Homepage</Button>
            </Link>
          </AnimatedContainer>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
