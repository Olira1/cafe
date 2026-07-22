import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { TableRestaurant, Receipt, AddCircle, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import WaiterLayout from '../../layouts/WaiterLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { formatTime } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setOrders(orderService.getAll().filter((o) => !['completed', 'cancelled'].includes(o.status)));
    setTables(tableService.getAll());
  }, []);

  const readyOrders = orders.filter((o) => o.status === 'ready');
  const occupied = tables.filter((t) => t.status === 'occupied').length;
  const available = tables.filter((t) => t.status === 'available').length;

  return (
    <WaiterLayout>
      <PageHeader title="Waiter Dashboard" subtitle={`Hello, ${user?.name}!`} breadcrumbs={[{ label: 'Waiter' }, { label: 'Dashboard' }]}
        actions={<Button variant="contained" startIcon={<AddCircle />} onClick={() => navigate('/waiter/create-order')}>New Order</Button>}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard title="My Active Orders" value={orders.length} icon={<Receipt />} color="#8E44AD" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard title="Ready to Serve" value={readyOrders.length} icon={<CheckCircle />} color="#27AE60" subtitle="Needs pickup" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard title="Occupied Tables" value={occupied} icon={<TableRestaurant />} color="#E74C3C" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard title="Available Tables" value={available} icon={<TableRestaurant />} color="#27AE60" /></Grid>

        {readyOrders.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ border: 2, borderColor: 'success.main' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="success.main" gutterBottom>🍽️ Ready to Serve ({readyOrders.length})</Typography>
                {readyOrders.map((order) => (
                  <Box key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography fontWeight={700}>{order.orderNumber}</Typography>
                    <Typography variant="caption" color="text.secondary">{(order.items || []).length} items • {formatTime(order.createdAt)}</Typography>
                    <Chip label="READY" size="small" color="success" />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>All Active Orders</Typography>
              {orders.length === 0 ? <Typography textAlign="center" color="text.secondary" py={4}>No active orders</Typography> : orders.map((order) => (
                <Box key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Box>
                    <Typography fontWeight={700}>{order.orderNumber}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatTime(order.createdAt)}</Typography>
                  </Box>
                  <Chip label={order.status} size="small" color={order.status === 'ready' ? 'success' : order.status === 'cooking' ? 'info' : 'warning'} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </WaiterLayout>
  );
}
