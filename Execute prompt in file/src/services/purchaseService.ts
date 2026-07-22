import { getAll, save } from '../utils/storage';
import { inventoryService } from './inventoryService';
import { auditService } from './auditService';

const KEY = 'rms_purchases';

export const purchaseService = {
  getAll: () => getAll<any>(KEY),
  getById: (id: string) => getAll<any>(KEY).find((p: any) => p.id === id) || null,

  create(data: any) {
    const purchases = getAll<any>(KEY);
    const purchase = {
      ...data,
      id: `pur_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    purchases.unshift(purchase);
    save(KEY, purchases);
    auditService.log('CREATE', `Purchase order created for ${data.supplierName}`);
    return purchase;
  },

  receive(id: string) {
    const purchases = getAll<any>(KEY);
    const idx = purchases.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    purchases[idx].status = 'received';
    purchases[idx].receivedAt = new Date().toISOString();
    // Increase inventory
    (purchases[idx].items || []).forEach((item: any) => {
      if (item.inventoryId) inventoryService.adjustStock(item.inventoryId, item.quantity);
    });
    save(KEY, purchases);
    auditService.log('UPDATE', `Purchase order received, inventory updated`);
    return purchases[idx];
  },

  cancel(id: string) {
    const purchases = getAll<any>(KEY);
    const idx = purchases.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    purchases[idx].status = 'cancelled';
    save(KEY, purchases);
    return purchases[idx];
  },
};
