import { getAll, getSingle, setSingle } from '../utils/storage';
import { auditService } from './auditService';

const USERS_KEY = 'rms_users';
const SESSION_KEY = 'rms_session';

export const authService = {
  login(email: string, password: string) {
    const users = getAll<any>(USERS_KEY);
    const user = users.find((u) => u.email === email && u.password === password && u.status === 'active');
    if (!user) return null;
    const session = { ...user, loginTime: new Date().toISOString() };
    setSingle(SESSION_KEY, session);
    auditService.log('LOGIN', `${user.name} logged in`, user.id);
    return session;
  },

  logout(userId?: string) {
    const session = getSingle<any>(SESSION_KEY);
    if (session) auditService.log('LOGOUT', `${session.name} logged out`, userId || session.id);
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser() {
    return getSingle<any>(SESSION_KEY);
  },

  isAuthenticated() {
    return !!getSingle(SESSION_KEY);
  },
};
