import DashboardLayout from './DashboardLayout';
import {
  Dashboard, People, RestaurantMenu, Inventory, LocalShipping,
  ShoppingCart, TableRestaurant, Receipt, BarChart, AccountBalance,
  PersonSearch, History, Settings,
} from '@mui/icons-material';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: <Dashboard fontSize="small" /> },
  { label: 'Employees', path: '/admin/employees', icon: <People fontSize="small" /> },
  { label: 'Menu Management', path: '/admin/menu', icon: <RestaurantMenu fontSize="small" /> },
  { label: 'Inventory', path: '/admin/inventory', icon: <Inventory fontSize="small" /> },
  { label: 'Suppliers', path: '/admin/suppliers', icon: <LocalShipping fontSize="small" /> },
  { label: 'Purchase Orders', path: '/admin/purchases', icon: <ShoppingCart fontSize="small" /> },
  { label: 'Tables', path: '/admin/tables', icon: <TableRestaurant fontSize="small" /> },
  { label: 'Orders', path: '/admin/orders', icon: <Receipt fontSize="small" /> },
  { label: 'Sales Reports', path: '/admin/reports', icon: <BarChart fontSize="small" /> },
  { label: 'Expenses', path: '/admin/expenses', icon: <AccountBalance fontSize="small" /> },
  { label: 'Customers', path: '/admin/customers', icon: <PersonSearch fontSize="small" /> },
  { label: 'Audit Logs', path: '/admin/audit', icon: <History fontSize="small" /> },
  { label: 'Settings', path: '/admin/settings', icon: <Settings fontSize="small" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navItems} roleLabel="Admin" roleColor="#FF6B35">{children}</DashboardLayout>;
}
