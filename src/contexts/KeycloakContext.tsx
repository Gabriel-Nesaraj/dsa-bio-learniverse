
import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { toast } from 'sonner';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  updateUserActivity: () => void;
  makeUserAdmin: (userId: string) => Promise<boolean>;
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  authenticated: false,
  user: null,
  isAdmin: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUserActivity: () => {},
  makeUserAdmin: async () => false
});

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        console.log("Initializing Keycloak...");
        
        // Initialize Keycloak
        const keycloakInstance = new Keycloak({
          url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
          realm: import.meta.env.VITE_KEYCLOAK_REALM || 'bioalgos',
          clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bioalgos-client'
        });
        
        const authenticated = await keycloakInstance.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        });
        
        if (authenticated) {
          // Get user info
          keycloakInstance.loadUserProfile().then(profile => {
            const userRoles = keycloakInstance.realmAccess?.roles || [];
            setUser({
              id: profile.id,
              name: profile.firstName + ' ' + profile.lastName,
              email: profile.email,
            });
            setIsAdmin(userRoles.includes('admin'));
            console.log("User authenticated:", profile);
          });
        } else {
          console.log("User not authenticated");
          setUser(null);
        }
        
        setKeycloak(keycloakInstance);
        setAuthenticated(authenticated);
        setIsLoading(false);
        
      } catch (error) {
        console.error("Failed to initialize Keycloak:", error);
        setIsLoading(false);
        // Fall back to localStorage if Keycloak fails to initialize
        fallbackToLocalStorage();
      }
    };
    
    // Fallback to localStorage login for development
    const fallbackToLocalStorage = () => {
      console.log("Using localStorage fallback for authentication");
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthenticated(true);
        setIsAdmin(parsedUser.isAdmin || false);
        toast.info("Using local authentication (Keycloak not available)");
      }
    };

    initKeycloak();
    
    // Cleanup
    return () => {
      // Nothing to clean up for Keycloak
    };
  }, []);
  
  const login = () => {
    if (keycloak) {
      keycloak.login();
    } else {
      // Fallback if Keycloak is not available
      window.location.href = '/login';
    }
  };
  
  const logout = () => {
    if (keycloak && authenticated) {
      keycloak.logout();
    } else {
      // Fallback if Keycloak is not available
      localStorage.removeItem('currentUser');
      setUser(null);
      setAuthenticated(false);
      setIsAdmin(false);
      window.location.href = '/';
    }
  };
  
  const updateUserActivity = () => {
    // This is a placeholder for the localStorage version
    // With Keycloak, we don't need to manually track activity
    console.log("User activity updated");
  };
  
  const makeUserAdmin = async (userId: string): Promise<boolean> => {
    if (!isAdmin) {
      console.error("Only admin users can make other users admin");
      toast.error("Permission denied");
      return false;
    }
    
    try {
      // In a real implementation, this would call the admin API
      // For now, just mock the behavior for local storage fallback
      if (!keycloak) {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: any) => {
          if (u.id === userId) {
            return { ...u, isAdmin: true };
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        toast.success("User is now an admin");
        return true;
      }
      
      // In the real implementation, call the Keycloak admin API
      toast.error("Keycloak admin API integration not implemented yet");
      return false;
    } catch (error) {
      console.error("Error making user admin:", error);
      toast.error("Failed to update user role");
      return false;
    }
  };

  const contextValue: KeycloakContextType = {
    keycloak,
    authenticated,
    user,
    isAdmin,
    isLoading,
    login,
    logout,
    updateUserActivity,
    makeUserAdmin
  };

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};
