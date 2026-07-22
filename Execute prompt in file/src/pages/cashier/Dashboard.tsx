import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Chip, Button } from '@mui/material';
import { AttachMoney, Receipt, TrendingUp, PointOfSale } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CashierLayout from '../../layouts/CashierLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

export default function CashierDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setOrders(orderService.getAll()); }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders.filter((o) => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0);
  const myOrders = orders.filter((o) => o.cashierId === user?.id);
  const pendingOrders = orders.filter((o) => ['pending', 'cooking', 'ready'].includes(o.status));

  return (
    <CashierLayout>
      <PageHeader title="Cashier Dashboard" subtitle={`Welcome, ${user?.name}`} breadcrumbs={[{ label: 'Cashier' }, { label: 'Dashboard' }]}
        actions={<Button variant="contained" startIcon={<PointOfSale />} onClick={() => navigate('/cashier/pos')}>Open POS</Button>}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Today's Revenue" value={formatCurrency(todayRevenue)} icon={<AttachMoney />} color="#27AE60" subtitle={`${todayOrders.length} orders today`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Pending Orders" value={pendingOrders.length} icon={<Receipt />} color="#F39C12" subtitle="Need attention" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="My Orders" value={myOrders.length} icon={<PointOfSale />} color="#2980B9" subtitle="Total processed" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Avg Order Value" value={todayOrders.length ? formatCurrency(todayRevenue / Math.max(todayOrders.filter((o) => o.status === 'completed').length, 1)) : '$0.00'} icon={<TrendingUp />} color="#8E44AD" />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Recent Orders</Typography>
              {orders.slice(0, 10).length === 0 ? (
                <Typography textAlign="center" color="text.secondary" py={4}>No orders yet. Start by opening the POS.</Typography>
              ) : (
                <List disablePadding>
                  {orders.slice(0, 10).map((order, i) => (
                    <Box key={order.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText primary={<><strong>{order.orderNumber}</strong> — {order.customerName || 'Walk-in'}</>} secondary={formatDateTime(order.createdAt)} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={700}>{formatCurrency(order.total || 0)}</Typography>
                          <Chip label={order.status} size="small" color={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'error' : 'warning'} />
                        </Box>
                      </ListItem>
                      {i < 9 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CashierLayout>
  );
}
