import { getAll, create, update, remove } from '../utils/storage';
import { auditService } from './auditService';

const KEY = 'rms_suppliers';

export const supplierService = {
  getAll: () => getAll<any>(KEY),
  getById: (id: string) => getAll<any>(KEY).find((s: any) => s.id === id) || null,
  create(data: any) { const r = create(KEY, data); auditService.log('CREATE', `Supplier "${data.name}" added`); return r; },
  update(id: string, data: any) { const r = update(KEY, id, data); auditService.log('UPDATE', `Supplier updated`); return r; },
  delete(id: string) { return remove(KEY, id); },
};
