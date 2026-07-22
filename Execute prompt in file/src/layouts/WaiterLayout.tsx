import DashboardLayout from './DashboardLayout';
import { Dashboard, TableRestaurant, AddCircle, Receipt, Notifications } from '@mui/icons-material';

const navItems = [
  { label: 'Dashboard', path: '/waiter', icon: <Dashboard fontSize="small" /> },
  { label: 'Tables', path: '/waiter/tables', icon: <TableRestaurant fontSize="small" /> },
  { label: 'Create Order', path: '/waiter/create-order', icon: <AddCircle fontSize="small" /> },
  { label: 'Active Orders', path: '/waiter/orders', icon: <Receipt fontSize="small" /> },
];

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navItems} roleLabel="Waiter" roleColor="#8E44AD">{children}</DashboardLayout>;
}
