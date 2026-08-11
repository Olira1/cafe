import { getAll, create, update, remove, save } from '../utils/storage';
import { auditService } from './auditService';

const KEY = 'rms_inventory';

export const inventoryService = {
  getAll: () => getAll<any>(KEY),
  getLowStock: () => getAll<any>(KEY).filter((i: any) => i.quantity <= i.minStock),
  getById: (id: string) => getAll<any>(KEY).find((i: any) => i.id === id) || null,

  create(data: any) {
    const r = create(KEY, data);
    auditService.log('CREATE', `Inventory item "${data.name}" added`);
    return r;
  },

  update(id: string, data: any) {
    const r = update(KEY, id, data);
    auditService.log('UPDATE', `Inventory "${data.name}" updated`);
    return r;
  },

  delete(id: string) {
    const r = remove(KEY, id);
    auditService.log('DELETE', `Inventory item deleted`);
    return r;
  },

  adjustStock(id: string, delta: number) {
    const items = getAll<any>(KEY);
    const idx = items.findIndex((i: any) => i.id === id);
    if (idx === -1) return null;
    items[idx].quantity = Math.max(0, items[idx].quantity + delta);
    save(KEY, items);
    return items[idx];
  },
};
