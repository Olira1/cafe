import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

const ROLE_DEFAULTS: Record<string, string> = {
  admin: '/admin',
  cashier: '/cashier',
  chef: '/chef',
  waiter: '/waiter',
};

export default function ProtectedRoute({ children, roles }: Props) {
  // TEMPORARY: Bypass all authentication - allow access to everything
  return <>{children}</>;
  
  // Original code commented out:
  // const { user, isAuthenticated } = useAuth();
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  // if (roles && !roles.includes(user?.role)) {
  //   return <Navigate to={ROLE_DEFAULTS[user?.role] || '/login'} replace />;
  // }
  // return <>{children}</>;
}
