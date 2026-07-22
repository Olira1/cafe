import { getAll, update, create, remove } from '../utils/storage';
import { auditService } from './auditService';

const KEY = 'rms_tables';

export const tableService = {
  getAll: () => getAll<any>(KEY),
  getById: (id: string) => getAll<any>(KEY).find((t: any) => t.id === id) || null,
  getAvailable: () => getAll<any>(KEY).filter((t: any) => t.status === 'available'),

  create(data: any) { const r = create(KEY, data); auditService.log('CREATE', `Table ${data.number} created`); return r; },
  update(id: string, data: any) { return update(KEY, id, data); },
  delete(id: string) { return remove(KEY, id); },
  updateStatus(id: string, status: string) {
    const r = update(KEY, id, { status });
    auditService.log('UPDATE', `Table status → ${status}`);
    return r;
  },
};
