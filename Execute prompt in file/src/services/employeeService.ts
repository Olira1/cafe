import { getAll, create, update, remove, save } from '../utils/storage';
import { auditService } from './auditService';

const KEY = 'rms_users';

export const employeeService = {
  getAll: () => getAll<any>(KEY),
  getEmployees: () => getAll<any>(KEY).filter((u: any) => u.role !== 'consumer'),
  getById: (id: string) => getAll<any>(KEY).find((u: any) => u.id === id) || null,

  create(data: any) {
    const users = getAll<any>(KEY);
    const email = String(data.email || '').trim().toLowerCase();
    if (users.some((u: any) => String(u.email || '').toLowerCase() === email)) throw new Error('Email already exists');
    const r = create(KEY, {
      ...data,
      name: String(data.name || '').trim(),
      email,
      salary: data.salary === undefined ? undefined : Number(data.salary),
      password: data.password || '123456',
      role: data.role || 'waiter',
      status: data.status || 'active',
    });
    auditService.log('CREATE', `Employee "${data.name}" created`);
    return r;
  },

  update(id: string, data: any) {
    const users = getAll<any>(KEY);
    const email = String(data.email || '').trim().toLowerCase();
    if (users.some((u: any) => u.id !== id && String(u.email || '').toLowerCase() === email)) {
      throw new Error('Email already exists');
    }
    const changes = {
      ...data,
      name: String(data.name || '').trim(),
      email,
      salary: data.salary === undefined ? undefined : Number(data.salary),
    };
    if (!changes.password) delete changes.password;
    const r = update(KEY, id, changes);
    auditService.log('UPDATE', `Employee "${data.name}" updated`);
    return r;
  },

  delete(id: string) {
    const r = remove(KEY, id);
    auditService.log('DELETE', `Employee deleted`);
    return r;
  },

  toggleStatus(id: string) {
    const users = getAll<any>(KEY);
    const user = users.find((u: any) => u.id === id);
    if (!user) return null;
    const updated = { ...user, status: user.status === 'active' ? 'inactive' : 'active' };
    const idx = users.findIndex((u: any) => u.id === id);
    users[idx] = updated;
    save(KEY, users);
    return updated;
  },
};
