import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import { AttachMoney, ShoppingBag, TableRestaurant, People, TrendingUp } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { employeeService } from '../../services/employeeService';
import { inventoryService } from '../../services/inventoryService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const COLORS = ['#FF6B35', '#2980B9', '#27AE60', '#F39C12', '#8E44AD'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    setOrders(orderService.getAll());
    setTables(tableService.getAll());
    setEmployees(employeeService.getEmployees());
    setLowStock(inventoryService.getLowStock());
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders.filter((o) => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0);
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;

  // Weekly revenue chart data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);
    const rev = orders.filter((o) => o.status === 'completed' && new Date(o.createdAt) >= d && new Date(o.createdAt) < nextD).reduce((s, o) => s + (o.total || 0), 0);
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), revenue: parseFloat(rev.toFixed(2)) };
  });

  const statusData = [
    { name: 'Completed', value: orders.filter((o) => o.status === 'completed').length || 0 },
    { name: 'Pending', value: orders.filter((o) => o.status === 'pending').length || 0 },
    { name: 'Cooking', value: orders.filter((o) => o.status === 'cooking').length || 0 },
    { name: 'Cancelled', value: orders.filter((o) => o.status === 'cancelled').length || 0 },
  ].filter((d) => d.value > 0);

  const recentOrders = orders.slice(0, 6);

  const tableStatus = [
    { label: 'Available', count: tables.filter((t) => t.status === 'available').length, color: '#27AE60' },
    { label: 'Occupied', count: tables.filter((t) => t.status === 'occupied').length, color: '#E74C3C' },
    { label: 'Reserved', count: tables.filter((t) => t.status === 'reserved').length, color: '#F39C12' },
    { label: 'Cleaning', count: tables.filter((t) => t.status === 'cleaning').length, color: '#2980B9' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Today's Revenue" value={formatCurrency(todayRevenue)} icon={<AttachMoney />} color="#27AE60" trend={12} subtitle={`${todayOrders.length} orders today`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Orders" value={orders.length} icon={<ShoppingBag />} color="#FF6B35" trend={8} subtitle={`${completedOrders} completed`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Active Tables" value={`${occupiedTables}/${tables.length}`} icon={<TableRestaurant />} color="#2980B9" subtitle="Tables occupied" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Employees" value={employees.filter((e) => e.status === 'active').length} icon={<People />} color="#8E44AD" subtitle={`${employees.length} total staff`} />
        </Grid>

        {/* Weekly Revenue Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Weekly Revenue</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                  <Bar dataKey="revenue" fill="#FF6B35" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Pie */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Order Status</Typography>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
                  <Typography color="text.secondary">No orders yet</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Table Status */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Table Status</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {tableStatus.map((s) => (
                  <Grid key={s.label} size={{ xs: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: `${s.color}15` }}>
                      <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.count}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Recent Orders</Typography>
              {recentOrders.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>No orders yet</Typography>
              ) : (
                <List disablePadding>
                  {recentOrders.map((order, i) => (
                    <Box key={order.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.75rem' }}>#{order.orderNumber?.slice(-3)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={600}>{order.orderNumber}</Typography>}
                          secondary={formatDateTime(order.createdAt)}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={700}>{formatCurrency(order.total || 0)}</Typography>
                          <Chip label={order.status} size="small" color={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'error' : 'warning'} />
                        </Box>
                      </ListItem>
                      {i < recentOrders.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock */}
        {lowStock.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ border: 2, borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="error" gutterBottom>⚠ Low Stock Alerts ({lowStock.length})</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {lowStock.map((item) => (
                    <Chip key={item.id} label={`${item.name}: ${item.quantity} ${item.unit}`} color="error" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </AdminLayout>
  );
}
