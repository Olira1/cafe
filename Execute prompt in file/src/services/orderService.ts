import { getAll, save } from '../utils/storage';
import { generateOrderNumber } from '../utils/formatters';
import { auditService } from './auditService';

const KEY = 'rms_orders';

export const orderService = {
  getAll: () => getAll<any>(KEY),
  getById: (id: string) => getAll<any>(KEY).find((o: any) => o.id === id) || null,
  getByStatus: (status: string) => getAll<any>(KEY).filter((o: any) => o.status === status),
  getByTable: (tableId: string) => getAll<any>(KEY).filter((o: any) => o.tableId === tableId && !['completed','cancelled'].includes(o.status)),

  create(data: any) {
    const orders = getAll<any>(KEY);
    const order = {
      ...data,
      id: `ord_${Date.now()}`,
      orderNumber: generateOrderNumber(),
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(order);
    save(KEY, orders);
    auditService.log('CREATE', `Order ${order.orderNumber} created`);
    return order;
  },

  update(id: string, changes: any) {
    const orders = getAll<any>(KEY);
    const idx = orders.findIndex((o: any) => o.id === id);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], ...changes, updatedAt: new Date().toISOString() };
    save(KEY, orders);
    return orders[idx];
  },

  updateStatus(id: string, status: string) {
    const order = this.update(id, { status });
    if (order) auditService.log('UPDATE', `Order ${order.orderNumber} → ${status}`);
    return order;
  },

  getRevenue(from: Date, to: Date) {
    const orders = getAll<any>(KEY).filter((o: any) => o.status === 'completed');
    return orders.filter((o: any) => {
      const d = new Date(o.createdAt);
      return d >= from && d <= to;
    }).reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  },

  getTopItems(limit = 5) {
    const orders = getAll<any>(KEY).filter((o: any) => o.status === 'completed');
    const counts: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach((o: any) => {
      (o.items || []).forEach((item: any) => {
        if (!counts[item.menuItemId]) counts[item.menuItemId] = { name: item.name, count: 0, revenue: 0 };
        counts[item.menuItemId].count += item.quantity;
        counts[item.menuItemId].revenue += item.price * item.quantity;
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, limit);
  },
};
