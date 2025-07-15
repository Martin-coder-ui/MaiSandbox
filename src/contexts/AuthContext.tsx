Here's the fixed version with all missing closing brackets and proper formatting:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabase } from '../lib/supabase';

// [Previous code remains unchanged until the login function]

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        
        // Fall back to test credentials for development
        if (TEST_CREDENTIALS[email] === password) {
          const foundUser = TEST_USERS.find(u => u.email === email);
          if (foundUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            localStorage.setItem('mai_current_user', JSON.stringify(foundUser));
            return true;
          }
        }
        
        return false;
      }
      
      // Successful Supabase login
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut().then(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('mai_current_user');
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  };

  const switchUser = (userId: string) => {
    const foundUser = TEST_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('mai_current_user', JSON.stringify(foundUser));
    }
  };

  const getTestUsers = () => TEST_USERS;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      switchUser,
      getTestUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```