import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Divider, Badge } from '@mui/material';
import { Timer, Kitchen } from '@mui/icons-material';
import ChefLayout from '../../layouts/ChefLayout';
import PageHeader from '../../components/common/PageHeader';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { formatTime } from '../../utils/formatters';
import { useNotifications } from '../../contexts/NotificationContext';

const COLUMNS = [
  { status: 'pending', label: 'Pending', color: '#F39C12', nextStatus: 'cooking', nextLabel: 'Start Cooking' },
  { status: 'cooking', label: 'Cooking', color: '#2980B9', nextStatus: 'ready', nextLabel: 'Mark Ready' },
  { status: 'ready', label: 'Ready to Serve', color: '#27AE60', nextStatus: 'served', nextLabel: 'Served' },
];

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  const load = () => {
    const allOrders = orderService.getAll().filter((o) => !['completed', 'cancelled'].includes(o.status));
    setOrders(allOrders);
    setTables(tableService.getAll());
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id: string, nextStatus: string) => {
    orderService.updateStatus(id, nextStatus);
    if (nextStatus === 'ready') addNotification('Order is ready to serve!', 'success');
    load();
  };

  const getTableNumber = (id: string) => {
    const t = tables.find((t) => t.id === id);
    return t ? `Table ${t.number}` : '-';
  };

  const getElapsed = (createdAt: string) => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return `${mins}m ago`;
  };

  const isUrgent = (createdAt: string) => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return mins > 20;
  };

  return (
    <ChefLayout>
      <PageHeader
        title="Kitchen Display System"
        subtitle="Live order queue — auto-refreshes every 10s"
        breadcrumbs={[{ label: 'Chef' }, { label: 'Kitchen' }]}
      />

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <Box key={col.status} sx={{ minWidth: 320, flex: 1 }}>
              {/* Column Header */}
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${col.color}20`, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: col.color }} />
                  <Typography fontWeight={800} sx={{ color: col.color }}>{col.label}</Typography>
                </Box>
                <Badge badgeContent={colOrders.length} color={col.status === 'pending' ? 'warning' : col.status === 'cooking' ? 'info' : 'success'}>
                  <Kitchen sx={{ color: col.color }} />
                </Badge>
              </Box>

              {/* Order Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {colOrders.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: 2, borderStyle: 'dashed' }}>
                    <Typography color="text.secondary" variant="body2">No orders</Typography>
                  </Box>
                ) : colOrders.map((order) => (
                  <Card key={order.id} sx={{ border: 2, borderColor: isUrgent(order.createdAt) && col.status !== 'ready' ? 'error.main' : col.color, transition: 'all 0.2s' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography fontWeight={800} variant="h6">{order.orderNumber}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.tableId ? getTableNumber(order.tableId) : order.type === 'takeaway' ? 'Takeaway' : 'Walk-in'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Timer sx={{ fontSize: 14, color: isUrgent(order.createdAt) ? 'error.main' : 'text.secondary' }} />
                            <Typography variant="caption" color={isUrgent(order.createdAt) ? 'error.main' : 'text.secondary'} fontWeight={isUrgent(order.createdAt) ? 700 : 400}>
                              {getElapsed(order.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">{formatTime(order.createdAt)}</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 1 }} />

                      {/* Items */}
                      <Box sx={{ mb: 1.5 }}>
                        {(order.items || []).map((item: any, i: number) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.25 }}>
                            <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                            <Chip label={`x${item.quantity}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                          </Box>
                        ))}
                      </Box>

                      {col.nextStatus && (
                        <Button fullWidth variant="contained" size="small"
                          sx={{ bgcolor: col.color, '&:hover': { bgcolor: col.color, opacity: 0.9 } }}
                          onClick={() => handleStatusChange(order.id, col.nextStatus)}
                        >
                          {col.nextLabel}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </ChefLayout>
  );
}
