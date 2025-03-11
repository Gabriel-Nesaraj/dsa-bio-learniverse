
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dna, Menu, X, LogOut } from 'lucide-react';
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useClerk
} from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Algorithms', path: '/algorithms' },
    { name: 'Data Structures', path: '/data-structures' },
    { name: 'Problems', path: '/problems' },
    { name: 'About', path: '/about' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled 
          ? 'glass-effect shadow-sm py-3' 
          : 'bg-transparent'
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Dna className="w-6 h-6 text-primary transition-all group-hover:animate-float" />
          <span className="font-medium text-lg tracking-tight">BioDSA</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
          
          <SignedOut>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center space-x-4">
              <Link to="/account" className="text-foreground/80 hover:text-primary transition-colors">
                My Account
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <UserButton afterSignOutUrl="/" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SignedIn>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-foreground focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass-effect shadow-md transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container px-4 mx-auto py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="text-foreground/80 py-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <SignedOut>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" size="sm" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
          
          <SignedIn>
            <Link 
              to="/account"
              className="text-foreground/80 py-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Account
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center" 
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
