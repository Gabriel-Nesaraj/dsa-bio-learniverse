
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dna, Menu, X, LogIn, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Algorithms', path: '/algorithms' },
    { name: 'Data Structures', path: '/data-structures' },
    { name: 'Problems', path: '/problems' },
    { name: 'About', path: '/about' },
  ];

  // Add admin link if user is admin
  if (user && isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

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
              className={cn(
                "text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                location.pathname === item.path && "text-primary after:w-full"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm">{user.name}</span>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
              >
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button 
                size="sm" 
                asChild
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
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
              className={cn(
                "text-foreground/80 py-2 hover:text-primary transition-colors",
                location.pathname === item.path && "text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <Link 
                to="/profile"
                className="flex items-center py-2 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 text-primary mr-2" />
                <span>{user.name}</span>
              </Link>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="flex items-center py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link 
                to="/signup"
                className="flex items-center py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
