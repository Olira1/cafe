import { getAll, create, update, remove } from '../utils/storage';
import { auditService } from './auditService';

const CAT_KEY = 'rms_categories';
const ITEMS_KEY = 'rms_menu_items';

export const menuService = {
  getCategories: () => getAll<any>(CAT_KEY),
  createCategory(data: any) { const r = create(CAT_KEY, data); auditService.log('CREATE', `Category "${data.name}" created`); return r; },
  updateCategory(id: string, data: any) { const r = update(CAT_KEY, id, data); auditService.log('UPDATE', `Category updated`); return r; },
  deleteCategory(id: string) { const r = remove(CAT_KEY, id); auditService.log('DELETE', `Category deleted`); return r; },

  getItems: () => getAll<any>(ITEMS_KEY),
  getAvailableItems: () => getAll<any>(ITEMS_KEY).filter((i: any) => i.available),
  getItemsByCategory: (catId: string) => getAll<any>(ITEMS_KEY).filter((i: any) => i.categoryId === catId),
  createItem(data: any) { const r = create(ITEMS_KEY, data); auditService.log('CREATE', `Menu item "${data.name}" created`); return r; },
  updateItem(id: string, data: any) { const r = update(ITEMS_KEY, id, data); auditService.log('UPDATE', `Menu item updated`); return r; },
  deleteItem(id: string) { const r = remove(ITEMS_KEY, id); auditService.log('DELETE', `Menu item deleted`); return r; },
};
