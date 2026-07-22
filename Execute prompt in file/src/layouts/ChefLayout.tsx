import DashboardLayout from './DashboardLayout';
import { Dashboard, Kitchen, Inventory, NotificationImportant } from '@mui/icons-material';

const navItems = [
  { label: 'Dashboard', path: '/chef', icon: <Dashboard fontSize="small" /> },
  { label: 'Kitchen Display', path: '/chef/kitchen', icon: <Kitchen fontSize="small" /> },
  { label: 'Inventory Alerts', path: '/chef/inventory-alerts', icon: <NotificationImportant fontSize="small" /> },
];

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navItems} roleLabel="Chef" roleColor="#27AE60">{children}</DashboardLayout>;
}
