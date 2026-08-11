import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { Kitchen, PendingActions, CheckCircle, Warning } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ChefLayout from '../../layouts/ChefLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { orderService } from '../../services/orderService';
import { inventoryService } from '../../services/inventoryService';
import { formatTime } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { getMenuItemImage } from '../../data/menuImages';

export default function ChefDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setOrders(orderService.getAll().filter((o) => !['completed', 'cancelled'].includes(o.status)));
    setLowStock(inventoryService.getLowStock());
  }, []);

  const pending = orders.filter((o) => o.status === 'pending');
  const cooking = orders.filter((o) => o.status === 'cooking');
  const ready = orders.filter((o) => o.status === 'ready');

  return (
    <ChefLayout>
      <PageHeader title="Chef Dashboard" subtitle={`Good day, ${user?.name}!`} breadcrumbs={[{ label: 'Chef' }, { label: 'Dashboard' }]}
        actions={<Button variant="contained" startIcon={<Kitchen />} onClick={() => navigate('/chef/kitchen')}>Open Kitchen Display</Button>}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Pending" value={pending.length} icon={<PendingActions />} color="#F39C12" subtitle="Orders waiting" /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Cooking" value={cooking.length} icon={<Kitchen />} color="#2980B9" subtitle="In progress" /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Ready" value={ready.length} icon={<CheckCircle />} color="#27AE60" subtitle="Ready to serve" /></Grid>

        {lowStock.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ border: 2, borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="warning.main" gutterBottom>⚠ Low Stock Alerts</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {lowStock.map((item) => <Chip key={item.id} label={`${item.name}: ${item.quantity} ${item.unit}`} color="warning" variant="outlined" />)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Active Orders</Typography>
              {orders.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" py={4}>No active orders</Typography>
              ) : orders.slice(0, 8).map((order) => (
                <Box key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 1, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Box>
                    <Typography fontWeight={700}>{order.orderNumber}</Typography>
                    <Typography variant="caption" color="text.secondary">{(order.items || []).length} items • {formatTime(order.createdAt)}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 'auto', mr: 2 }}>
                    {(order.items || []).slice(0, 4).map((item: any, index: number) => (
                      getMenuItemImage(item) && (
                        <Box
                          key={`${item.menuItemId || item.name}-${index}`}
                          component="img"
                          src={getMenuItemImage(item)}
                          alt={item.name}
                          sx={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: 2, borderColor: 'background.paper', ml: index === 0 ? 0 : -0.75 }}
                        />
                      )
                    ))}
                  </Box>
                  <Chip label={order.status} size="small" color={order.status === 'pending' ? 'warning' : order.status === 'cooking' ? 'info' : 'success'} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ChefLayout>
  );
}
