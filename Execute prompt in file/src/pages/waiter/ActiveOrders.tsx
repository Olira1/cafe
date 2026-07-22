import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Button, Grid } from '@mui/material';
import WaiterLayout from '../../layouts/WaiterLayout';
import PageHeader from '../../components/common/PageHeader';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { formatTime } from '../../utils/formatters';
import { useNotifications } from '../../contexts/NotificationContext';
import EmptyState from '../../components/common/EmptyState';

const STATUS_COLORS: Record<string, any> = { pending: 'warning', cooking: 'info', ready: 'success', served: 'secondary' };

export default function ActiveOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  const load = () => {
    setOrders(orderService.getAll().filter((o) => !['completed', 'cancelled'].includes(o.status)));
    setTables(tableService.getAll());
  };
  useEffect(load, []);

  const getTableNum = (id: string) => tables.find((t) => t.id === id)?.number || '-';

  const handleServed = (id: string) => { orderService.updateStatus(id, 'served'); addNotification('Order marked as served', 'info'); load(); };
  const handleBill = (id: string) => { orderService.updateStatus(id, 'completed'); addNotification('Bill requested — order completed', 'success'); load(); };

  return (
    <WaiterLayout>
      <PageHeader title="Active Orders" subtitle={`${orders.length} active`} breadcrumbs={[{ label: 'Waiter' }, { label: 'Active Orders' }]} />

      {orders.length === 0 ? (
        <EmptyState title="No active orders" description="All orders have been completed or cancelled." />
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid key={order.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ border: 2, borderColor: order.status === 'ready' ? 'success.main' : 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography fontWeight={800}>{order.orderNumber}</Typography>
                    <Chip label={order.status} size="small" color={STATUS_COLORS[order.status] || 'default'} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{order.tableId ? `Table ${getTableNum(order.tableId)}` : 'Takeaway'} · {formatTime(order.createdAt)}</Typography>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    {(order.items || []).map((item: any, i: number) => (
                      <Typography key={i} variant="body2">{item.name} × {item.quantity}</Typography>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {order.status === 'ready' && <Button size="small" variant="contained" color="success" onClick={() => handleServed(order.id)} fullWidth>Served</Button>}
                    {order.status === 'served' && <Button size="small" variant="contained" color="secondary" onClick={() => handleBill(order.id)} fullWidth>Request Bill</Button>}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </WaiterLayout>
  );
}
