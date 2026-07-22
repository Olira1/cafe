export const DEFAULT_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@restaurant.com', password: '123456', role: 'admin', status: 'active', phone: '555-0001', salary: 8000, joinDate: '2023-01-01', avatar: '' },
  { id: 'u2', name: 'John Cashier', email: 'cashier@restaurant.com', password: '123456', role: 'cashier', status: 'active', phone: '555-0002', salary: 3500, joinDate: '2023-02-15', avatar: '' },
  { id: 'u3', name: 'Maria Chef', email: 'chef@restaurant.com', password: '123456', role: 'chef', status: 'active', phone: '555-0003', salary: 5000, joinDate: '2023-01-20', avatar: '' },
  { id: 'u4', name: 'Tom Waiter', email: 'waiter@restaurant.com', password: '123456', role: 'waiter', status: 'active', phone: '555-0004', salary: 2500, joinDate: '2023-03-10', avatar: '' },
];

export const DEFAULT_CATEGORIES = [
  { id: 'cat1', name: 'Appetizers', description: 'Starters and small bites', icon: '🥗', active: true },
  { id: 'cat2', name: 'Main Course', description: 'Primary dishes', icon: '🍽️', active: true },
  { id: 'cat3', name: 'Desserts', description: 'Sweet endings', icon: '🍰', active: true },
  { id: 'cat4', name: 'Beverages', description: 'Drinks and refreshments', icon: '🥤', active: true },
  { id: 'cat5', name: 'Pizza', description: 'Wood-fired pizzas', icon: '🍕', active: true },
  { id: 'cat6', name: 'Burgers', description: 'Gourmet burgers', icon: '🍔', active: true },
];

export const DEFAULT_MENU_ITEMS = [
  { id: 'm1', name: 'Caesar Salad', categoryId: 'cat1', price: 12.99, description: 'Crisp romaine, parmesan, house croutons', image: '', available: true, type: 'food', preparationTime: 10 },
  { id: 'm2', name: 'Garlic Bread', categoryId: 'cat1', price: 6.99, description: 'Toasted with herb butter', image: '', available: true, type: 'food', preparationTime: 8 },
  { id: 'm3', name: 'Spring Rolls', categoryId: 'cat1', price: 9.99, description: 'Crispy veggie rolls with sweet chili sauce', image: '', available: true, type: 'food', preparationTime: 12 },
  { id: 'm4', name: 'Grilled Salmon', categoryId: 'cat2', price: 28.99, description: 'Atlantic salmon, lemon butter, seasonal veg', image: '', available: true, type: 'food', preparationTime: 20 },
  { id: 'm5', name: 'Ribeye Steak', categoryId: 'cat2', price: 42.99, description: '12oz prime ribeye, truffle fries, red wine jus', image: '', available: true, type: 'food', preparationTime: 25 },
  { id: 'm6', name: 'Chicken Alfredo', categoryId: 'cat2', price: 19.99, description: 'Grilled chicken, fettuccine, cream sauce', image: '', available: true, type: 'food', preparationTime: 18 },
  { id: 'm7', name: 'Veggie Pasta', categoryId: 'cat2', price: 16.99, description: 'Seasonal vegetables, marinara, penne', image: '', available: true, type: 'food', preparationTime: 15 },
  { id: 'm8', name: 'Chocolate Lava Cake', categoryId: 'cat3', price: 11.99, description: 'Warm chocolate cake, vanilla ice cream', image: '', available: true, type: 'food', preparationTime: 15 },
  { id: 'm9', name: 'Tiramisu', categoryId: 'cat3', price: 9.99, description: 'Classic Italian dessert', image: '', available: true, type: 'food', preparationTime: 5 },
  { id: 'm10', name: 'Cheesecake', categoryId: 'cat3', price: 8.99, description: 'New York style with berry compote', image: '', available: true, type: 'food', preparationTime: 5 },
  { id: 'm11', name: 'Lemonade', categoryId: 'cat4', price: 4.99, description: 'Fresh squeezed', image: '', available: true, type: 'drink', preparationTime: 3 },
  { id: 'm12', name: 'Iced Tea', categoryId: 'cat4', price: 3.99, description: 'Brewed black tea with lemon', image: '', available: true, type: 'drink', preparationTime: 2 },
  { id: 'm13', name: 'Craft Beer', categoryId: 'cat4', price: 7.99, description: 'Local IPA', image: '', available: true, type: 'drink', preparationTime: 2 },
  { id: 'm14', name: 'Sparkling Water', categoryId: 'cat4', price: 2.99, description: 'Imported sparkling mineral water', image: '', available: true, type: 'drink', preparationTime: 1 },
  { id: 'm15', name: 'Margherita Pizza', categoryId: 'cat5', price: 18.99, description: 'Fresh mozzarella, tomato, basil', image: '', available: true, type: 'food', preparationTime: 20 },
  { id: 'm16', name: 'Pepperoni Pizza', categoryId: 'cat5', price: 21.99, description: 'Double pepperoni, mozzarella', image: '', available: true, type: 'food', preparationTime: 22 },
  { id: 'm17', name: 'Classic Burger', categoryId: 'cat6', price: 14.99, description: 'Angus beef, lettuce, tomato, pickles', image: '', available: true, type: 'food', preparationTime: 15 },
  { id: 'm18', name: 'BBQ Burger', categoryId: 'cat6', price: 16.99, description: 'Smoked brisket, coleslaw, BBQ sauce', image: '', available: true, type: 'food', preparationTime: 15 },
];

export const DEFAULT_INVENTORY = [
  { id: 'inv1', name: 'Chicken Breast', unit: 'kg', quantity: 25, minStock: 5, costPerUnit: 8.5, expiryDate: '2025-08-10', supplierId: 'sup1', category: 'Meat' },
  { id: 'inv2', name: 'Salmon Fillet', unit: 'kg', quantity: 12, minStock: 3, costPerUnit: 22, expiryDate: '2025-08-05', supplierId: 'sup1', category: 'Seafood' },
  { id: 'inv3', name: 'Ribeye Beef', unit: 'kg', quantity: 18, minStock: 5, costPerUnit: 30, expiryDate: '2025-08-08', supplierId: 'sup1', category: 'Meat' },
  { id: 'inv4', name: 'All-Purpose Flour', unit: 'kg', quantity: 50, minStock: 10, costPerUnit: 1.2, expiryDate: '2026-01-01', supplierId: 'sup2', category: 'Dry Goods' },
  { id: 'inv5', name: 'Olive Oil', unit: 'L', quantity: 8, minStock: 2, costPerUnit: 12, expiryDate: '2026-06-01', supplierId: 'sup2', category: 'Oils' },
  { id: 'inv6', name: 'Heavy Cream', unit: 'L', quantity: 4, minStock: 2, costPerUnit: 4.5, expiryDate: '2025-08-03', supplierId: 'sup3', category: 'Dairy' },
  { id: 'inv7', name: 'Mozzarella Cheese', unit: 'kg', quantity: 10, minStock: 3, costPerUnit: 9, expiryDate: '2025-08-12', supplierId: 'sup3', category: 'Dairy' },
  { id: 'inv8', name: 'Tomatoes', unit: 'kg', quantity: 20, minStock: 5, costPerUnit: 2.5, expiryDate: '2025-08-04', supplierId: 'sup4', category: 'Produce' },
  { id: 'inv9', name: 'Lettuce', unit: 'kg', quantity: 2, minStock: 3, costPerUnit: 3, expiryDate: '2025-08-02', supplierId: 'sup4', category: 'Produce' },
  { id: 'inv10', name: 'Garlic', unit: 'kg', quantity: 5, minStock: 2, costPerUnit: 4, expiryDate: '2025-09-01', supplierId: 'sup4', category: 'Produce' },
  { id: 'inv11', name: 'Cocoa Powder', unit: 'kg', quantity: 3, minStock: 1, costPerUnit: 15, expiryDate: '2026-01-01', supplierId: 'sup2', category: 'Baking' },
  { id: 'inv12', name: 'Pasta (Penne)', unit: 'kg', quantity: 25, minStock: 5, costPerUnit: 2, expiryDate: '2026-12-01', supplierId: 'sup2', category: 'Dry Goods' },
];

export const DEFAULT_TABLES = [
  { id: 'tbl1', number: 1, capacity: 2, status: 'available', section: 'Main Hall' },
  { id: 'tbl2', number: 2, capacity: 2, status: 'occupied', section: 'Main Hall' },
  { id: 'tbl3', number: 3, capacity: 4, status: 'available', section: 'Main Hall' },
  { id: 'tbl4', number: 4, capacity: 4, status: 'reserved', section: 'Main Hall' },
  { id: 'tbl5', number: 5, capacity: 6, status: 'available', section: 'Main Hall' },
  { id: 'tbl6', number: 6, capacity: 6, status: 'cleaning', section: 'Main Hall' },
  { id: 'tbl7', number: 7, capacity: 4, status: 'available', section: 'Terrace' },
  { id: 'tbl8', number: 8, capacity: 4, status: 'occupied', section: 'Terrace' },
  { id: 'tbl9', number: 9, capacity: 2, status: 'available', section: 'Terrace' },
  { id: 'tbl10', number: 10, capacity: 8, status: 'available', section: 'Private Room' },
  { id: 'tbl11', number: 11, capacity: 10, status: 'reserved', section: 'Private Room' },
  { id: 'tbl12', number: 12, capacity: 6, status: 'available', section: 'Bar Area' },
];

export const DEFAULT_SUPPLIERS = [
  { id: 'sup1', name: 'Prime Meats Co.', contact: 'Bob Miller', email: 'bob@primemeats.com', phone: '555-1001', address: '123 Meat St', category: 'Meat & Seafood', status: 'active' },
  { id: 'sup2', name: 'Dry Goods Direct', contact: 'Jane Smith', email: 'jane@drygoodsdirect.com', phone: '555-1002', address: '456 Pantry Ave', category: 'Dry Goods', status: 'active' },
  { id: 'sup3', name: 'Dairy Fresh', contact: 'Mike Johnson', email: 'mike@dairyfresh.com', phone: '555-1003', address: '789 Farm Road', category: 'Dairy', status: 'active' },
  { id: 'sup4', name: 'Green Valley Produce', contact: 'Sarah Lee', email: 'sarah@greenvalley.com', phone: '555-1004', address: '321 Garden Blvd', category: 'Produce', status: 'active' },
];

export const DEFAULT_CUSTOMERS = [
  { id: 'cus1', name: 'Alice Brown', email: 'alice@email.com', phone: '555-2001', joinDate: '2024-01-15', totalOrders: 12, totalSpent: 380.5, favoriteItems: ['m4', 'm8'], notes: 'VIP customer' },
  { id: 'cus2', name: 'Bob Wilson', email: 'bob@email.com', phone: '555-2002', joinDate: '2024-02-20', totalOrders: 7, totalSpent: 215.0, favoriteItems: ['m5', 'm13'], notes: '' },
  { id: 'cus3', name: 'Carol Davis', email: 'carol@email.com', phone: '555-2003', joinDate: '2024-03-05', totalOrders: 4, totalSpent: 120.0, favoriteItems: ['m15', 'm11'], notes: 'Allergic to nuts' },
];

export const DEFAULT_EXPENSES = [
  { id: 'exp1', category: 'Rent', description: 'Monthly rent', amount: 4500, date: '2025-07-01', recurring: true, vendor: 'Building Corp' },
  { id: 'exp2', category: 'Utilities', description: 'Electricity bill', amount: 850, date: '2025-07-05', recurring: true, vendor: 'City Power' },
  { id: 'exp3', category: 'Salary', description: 'Staff payroll', amount: 18500, date: '2025-07-01', recurring: true, vendor: 'Internal' },
  { id: 'exp4', category: 'Maintenance', description: 'Kitchen equipment service', amount: 320, date: '2025-07-10', recurring: false, vendor: 'Fix It Pro' },
];

export const DEFAULT_SETTINGS = {
  restaurantName: 'The Grand Bistro',
  logo: '',
  tax: 8.5,
  currency: 'USD',
  currencySymbol: '$',
  openingHours: { mon: '09:00-22:00', tue: '09:00-22:00', wed: '09:00-22:00', thu: '09:00-22:00', fri: '09:00-23:00', sat: '10:00-23:00', sun: '10:00-21:00' },
  address: '1 Gourmet Lane, Foodville',
  phone: '555-BISTRO',
  email: 'info@grandbistro.com',
  timezone: 'America/New_York',
};

export const DEFAULT_ORDERS: any[] = [];

export const DEFAULT_PURCHASES: any[] = [];

export const DEFAULT_AUDIT_LOGS: any[] = [];

export function initializeData() {
  const seed = (key: string, data: any) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };
  seed('rms_users', DEFAULT_USERS);
  seed('rms_categories', DEFAULT_CATEGORIES);
  seed('rms_menu_items', DEFAULT_MENU_ITEMS);
  seed('rms_inventory', DEFAULT_INVENTORY);
  seed('rms_tables', DEFAULT_TABLES);
  seed('rms_suppliers', DEFAULT_SUPPLIERS);
  seed('rms_customers', DEFAULT_CUSTOMERS);
  seed('rms_expenses', DEFAULT_EXPENSES);
  seed('rms_settings', DEFAULT_SETTINGS);
  seed('rms_orders', DEFAULT_ORDERS);
  seed('rms_purchases', DEFAULT_PURCHASES);
  seed('rms_audit_logs', DEFAULT_AUDIT_LOGS);
}
