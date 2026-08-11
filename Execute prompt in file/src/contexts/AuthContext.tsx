import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => any;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TEMPORARY: Always return a mock admin user for testing
  const mockAdminUser = {
    id: 'temp-admin',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin',
    status: 'active'
  };

  const [user, setUser] = useState<any>(mockAdminUser);

  useEffect(() => {
    // TEMPORARY: Always set mock user instead of checking auth
    setUser(mockAdminUser);
  }, []);

  const login = (email: string, password: string) => {
    // TEMPORARY: Always return success with mock user
    setUser(mockAdminUser);
    return mockAdminUser;
  };

  const logout = () => {
    // TEMPORARY: Don't actually log out, just keep mock user
    // authService.logout(user?.id);
    // setUser(null);
    setUser(mockAdminUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
