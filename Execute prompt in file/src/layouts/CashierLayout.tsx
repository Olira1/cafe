import DashboardLayout from './DashboardLayout';
import { Dashboard, PointOfSale, Receipt, Payment, Today } from '@mui/icons-material';

const navItems = [
  { label: 'Dashboard', path: '/cashier', icon: <Dashboard fontSize="small" /> },
  { label: 'POS', path: '/cashier/pos', icon: <PointOfSale fontSize="small" /> },
  { label: 'Orders', path: '/cashier/orders', icon: <Receipt fontSize="small" /> },
  { label: "Today's Sales", path: '/cashier/sales', icon: <Today fontSize="small" /> },
];

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={navItems} roleLabel="Cashier" roleColor="#2980B9">{children}</DashboardLayout>;
}
