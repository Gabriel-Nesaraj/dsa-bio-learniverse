
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  lastActivity?: number; // Track last activity time
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  makeUserAdmin: (userId: string) => Promise<boolean>;
  upgradeToAdmin: (email: string, password: string) => Promise<boolean>;
  updateUserActivity: () => void; // New method to update user activity
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(!!parsedUser.isAdmin);
    }
    setIsLoading(false);
  }, []);

  // Update user activity to prevent progress reset
  const updateUserActivity = () => {
    if (user) {
      const updatedUser = { ...user, lastActivity: Date.now() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in users collection
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          const { password, ...userWithoutPassword } = { 
            ...u, 
            lastActivity: Date.now() 
          };
          return { ...u, lastActivity: Date.now() };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, you would validate against a backend
      // For this demo, we'll check localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        const userWithActivity = { 
          ...userWithoutPassword, 
          lastActivity: Date.now() 
        };
        
        setUser(userWithActivity);
        setIsAdmin(!!userWithActivity.isAdmin);
        localStorage.setItem('user', JSON.stringify(userWithActivity));
        
        // Update user's last activity in users collection
        const updatedUsers = users.map((u: any) => {
          if (u.id === foundUser.id) {
            return { ...u, lastActivity: Date.now() };
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Log for debugging
        console.log('Login successful', { user: userWithActivity, isAdmin: !!userWithActivity.isAdmin });
        
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, you would create a user in your backend
      // For this demo, we'll store in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        console.log('User already exists during signup', { email });
        return false;
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password, // In a real app, NEVER store passwords in plain text
        isAdmin: false, // New users are not admins by default
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      console.log('Signup successful', { email, isAdmin: false });
      return true;
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const makeUserAdmin = async (userId: string): Promise<boolean> => {
    if (!isAdmin) return false;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.id === userId) {
          return { ...u, isAdmin: true };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // If the updated user is the current user, update the current user in state and localStorage
      if (user && user.id === userId) {
        const updatedUser = { ...user, isAdmin: true };
        setUser(updatedUser);
        setIsAdmin(true);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      console.error("Error making user admin:", error);
      return false;
    }
  };

  const upgradeToAdmin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting to upgrade user to admin', { email });
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === email && u.password === password);
      
      console.log('User found in storage:', userIndex !== -1);
      
      if (userIndex === -1) {
        return false; // User not found or password incorrect
      }
      
      // Update the user to be an admin
      users[userIndex] = { ...users[userIndex], isAdmin: true };
      localStorage.setItem('users', JSON.stringify(users));
      
      // If the user is currently logged in, update the current session
      if (user && user.email === email) {
        const updatedUser = { ...user, isAdmin: true };
        setUser(updatedUser);
        setIsAdmin(true);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      console.log('User upgraded to admin successfully', { email });
      return true;
    } catch (error) {
      console.error("Error upgrading user to admin:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading, 
      isAdmin,
      makeUserAdmin,
      upgradeToAdmin,
      updateUserActivity
    }}>
      {children}
    </AuthContext.Provider>
  );
};
