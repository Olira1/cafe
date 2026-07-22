import { getAll, create, update, remove } from '../utils/storage';
import { auditService } from './auditService';

const KEY = 'rms_expenses';

export const expenseService = {
  getAll: () => getAll<any>(KEY),
  getByCategory: (cat: string) => getAll<any>(KEY).filter((e: any) => e.category === cat),
  getTotalForMonth: (year: number, month: number) => {
    return getAll<any>(KEY).filter((e: any) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }).reduce((sum: number, e: any) => sum + e.amount, 0);
  },
  create(data: any) { const r = create(KEY, data); auditService.log('CREATE', `Expense "${data.description}" recorded`); return r; },
  update(id: string, data: any) { return update(KEY, id, data); },
  delete(id: string) { return remove(KEY, id); },
};
