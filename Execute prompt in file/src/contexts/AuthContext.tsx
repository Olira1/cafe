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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) setUser(current);
  }, []);

  const login = (email: string, password: string) => {
    const u = authService.login(email, password);
    if (u) setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout(user?.id);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
