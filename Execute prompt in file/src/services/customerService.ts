import { getAll, create, update, remove, save } from '../utils/storage';
import { auditService } from './auditService';

const KEY = 'rms_customers';

export const customerService = {
  getAll: () => getAll<any>(KEY),
  getById: (id: string) => getAll<any>(KEY).find((c: any) => c.id === id) || null,

  create(data: any) {
    const r = create(KEY, { ...data, joinDate: new Date().toISOString().split('T')[0], totalOrders: 0, totalSpent: 0, favoriteItems: [] });
    auditService.log('CREATE', `Customer "${data.name}" added`);
    return r;
  },

  update(id: string, data: any) { return update(KEY, id, data); },
  delete(id: string) { return remove(KEY, id); },

  incrementOrders(id: string, amount: number) {
    const customers = getAll<any>(KEY);
    const idx = customers.findIndex((c: any) => c.id === id);
    if (idx === -1) return;
    customers[idx].totalOrders = (customers[idx].totalOrders || 0) + 1;
    customers[idx].totalSpent = (customers[idx].totalSpent || 0) + amount;
    save(KEY, customers);
  },
};
