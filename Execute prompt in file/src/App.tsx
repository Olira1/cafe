import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { initializeData } from './data/defaultData';
import { DEVELOPMENT_SYNC_EVENT, startDevelopmentSync } from './utils/developmentSync';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
import MenuManagement from './pages/admin/MenuManagement';
import Inventory from './pages/admin/Inventory';
import Suppliers from './pages/admin/Suppliers';
import Purchases from './pages/admin/Purchases';
import AdminTables from './pages/admin/Tables';
import AdminOrders from './pages/admin/Orders';
import Reports from './pages/admin/Reports';
import Expenses from './pages/admin/Expenses';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import AuditLogs from './pages/admin/AuditLogs';

// Cashier
import CashierDashboard from './pages/cashier/Dashboard';
import POS from './pages/cashier/POS';
import CashierOrders from './pages/cashier/Orders';
import CashierSales from './pages/cashier/Sales';

// Chef
import ChefDashboard from './pages/chef/Dashboard';
import KitchenDisplay from './pages/chef/KitchenDisplay';
import InventoryAlerts from './pages/chef/InventoryAlerts';

// Waiter
import WaiterDashboard from './pages/waiter/Dashboard';
import WaiterTables from './pages/waiter/Tables';
import CreateOrder from './pages/waiter/CreateOrder';
import ActiveOrders from './pages/waiter/ActiveOrders';

// Consumer / QR
import ConsumerHome from './pages/consumer/Home';
import ConsumerMenu from './pages/consumer/Menu';
import QRMenu from './pages/qr/QRMenu';

function RootRedirect() {
  // TEMPORARY: Always redirect to admin dashboard
  return <Navigate to="/admin" replace />;
  
  // Original code commented out:
  // const { user, isAuthenticated } = useAuth();
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  // const routes: Record<string, string> = { admin: '/admin', cashier: '/cashier', chef: '/chef', waiter: '/waiter' };
  // return <Navigate to={routes[user?.role] || '/login'} replace />;
}

function AppRoutes() {
  const location = useLocation();
  const [syncVersion, setSyncVersion] = useState(0);

  useEffect(() => {
    initializeData();
    return startDevelopmentSync();
  }, []);

  useEffect(() => {
    const handleDevelopmentSync = () => {
      const isEditingOrder = location.pathname === '/waiter/create-order' || location.pathname === '/cashier/pos';
      if (!isEditingOrder) setSyncVersion((current) => current + 1);
    };

    window.addEventListener(DEVELOPMENT_SYNC_EVENT, handleDevelopmentSync);
    return () => window.removeEventListener(DEVELOPMENT_SYNC_EVENT, handleDevelopmentSync);
  }, [location.pathname]);

  return (
    <Routes key={syncVersion}>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<AdminDashboard />} />

      {/* TEMPORARY: Direct access routes for testing */}
      <Route path="/test-admin" element={<AdminDashboard />} />
      <Route path="/test-cashier" element={<CashierDashboard />} />
      <Route path="/test-chef" element={<ChefDashboard />} />
      <Route path="/test-waiter" element={<WaiterDashboard />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute roles={['admin']}><Employees /></ProtectedRoute>} />
      <Route path="/admin/menu" element={<ProtectedRoute roles={['admin']}><MenuManagement /></ProtectedRoute>} />
      <Route path="/admin/inventory" element={<ProtectedRoute roles={['admin']}><Inventory /></ProtectedRoute>} />
      <Route path="/admin/suppliers" element={<ProtectedRoute roles={['admin']}><Suppliers /></ProtectedRoute>} />
      <Route path="/admin/purchases" element={<ProtectedRoute roles={['admin']}><Purchases /></ProtectedRoute>} />
      <Route path="/admin/tables" element={<ProtectedRoute roles={['admin']}><AdminTables /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
      <Route path="/admin/expenses" element={<ProtectedRoute roles={['admin']}><Expenses /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute roles={['admin']}><Customers /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute roles={['admin']}><AuditLogs /></ProtectedRoute>} />

      {/* Cashier */}
      <Route path="/cashier" element={<ProtectedRoute roles={['cashier']}><CashierDashboard /></ProtectedRoute>} />
      <Route path="/cashier/pos" element={<ProtectedRoute roles={['cashier']}><POS /></ProtectedRoute>} />
      <Route path="/cashier/orders" element={<ProtectedRoute roles={['cashier']}><CashierOrders /></ProtectedRoute>} />
      <Route path="/cashier/sales" element={<ProtectedRoute roles={['cashier']}><CashierSales /></ProtectedRoute>} />

      {/* Chef */}
      <Route path="/chef" element={<ProtectedRoute roles={['chef']}><ChefDashboard /></ProtectedRoute>} />
      <Route path="/chef/kitchen" element={<ProtectedRoute roles={['chef']}><KitchenDisplay /></ProtectedRoute>} />
      <Route path="/chef/inventory-alerts" element={<ProtectedRoute roles={['chef']}><InventoryAlerts /></ProtectedRoute>} />

      {/* Waiter */}
      <Route path="/waiter" element={<ProtectedRoute roles={['waiter']}><WaiterDashboard /></ProtectedRoute>} />
      <Route path="/waiter/tables" element={<ProtectedRoute roles={['waiter']}><WaiterTables /></ProtectedRoute>} />
      <Route path="/waiter/create-order" element={<ProtectedRoute roles={['waiter']}><CreateOrder /></ProtectedRoute>} />
      <Route path="/waiter/orders" element={<ProtectedRoute roles={['waiter']}><ActiveOrders /></ProtectedRoute>} />

      {/* Public */}
      <Route path="/consumer" element={<ConsumerHome />} />
      <Route path="/consumer/menu" element={<ConsumerMenu />} />
      <Route path="/qr" element={<QRMenu />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
