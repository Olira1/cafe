import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Tab, Tabs, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { orderService } from '../../services/orderService';
import { inventoryService } from '../../services/inventoryService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { AttachMoney, ShoppingBag, TrendingUp, Inventory } from '@mui/icons-material';

export default function Reports() {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    setOrders(orderService.getAll());
    setLowStock(inventoryService.getLowStock());
  }, []);

  const completed = orders.filter((o) => o.status === 'completed');
  const totalRevenue = completed.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrderValue = completed.length ? totalRevenue / completed.length : 0;

  const today = new Date();

  // Daily data (last 30 days)
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(next.getDate() + 1);
    const dayOrders = completed.filter((o) => { const od = new Date(o.createdAt); return od >= d && od < next; });
    return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: parseFloat(dayOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)), orders: dayOrders.length };
  });

  // Weekly data (last 12 weeks)
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const start = new Date(today);
    start.setDate(start.getDate() - (11 - i) * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 7);
    const wOrders = completed.filter((o) => { const od = new Date(o.createdAt); return od >= start && od < end; });
    return { week: `W${i + 1}`, revenue: parseFloat(wOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)), orders: wOrders.length };
  });

  // Monthly data (last 12 months)
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const mOrders = completed.filter((o) => { const od = new Date(o.createdAt); return od >= d && od < next; });
    return { month: d.toLocaleDateString('en-US', { month: 'short' }), revenue: parseFloat(mOrders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)), orders: mOrders.length };
  });

  const topItems = orderService.getTopItems(10);

  const chartData = [dailyData.slice(-14), weeklyData, monthlyData][tab];
  const xKey = ['date', 'week', 'month'][tab];

  return (
    <AdminLayout>
      <PageHeader title="Sales Reports" subtitle="Analytics and performance insights" breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }]} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<AttachMoney />} color="#27AE60" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Completed Orders" value={completed.length} icon={<ShoppingBag />} color="#FF6B35" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Avg Order Value" value={formatCurrency(avgOrderValue)} icon={<TrendingUp />} color="#2980B9" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Low Stock Items" value={lowStock.length} icon={<Inventory />} color="#E74C3C" subtitle="Needs restocking" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Revenue Overview</Typography>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ '& .MuiTab-root': { minWidth: 80 } }}>
                  <Tab label="Daily" />
                  <Tab label="Weekly" />
                  <Tab label="Monthly" />
                </Tabs>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData as any[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="revenue" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any, name: string) => name === 'revenue' ? formatCurrency(v) : v} />
                  <Legend />
                  <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} dot={false} name="Revenue ($)" />
                  <Line yAxisId="orders" type="monotone" dataKey="orders" stroke="#2980B9" strokeWidth={2} dot={false} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Top Selling Items</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty Sold</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topItems.length === 0 ? (
                      <TableRow><TableCell colSpan={4}><Typography textAlign="center" color="text.secondary" py={2}>No sales data yet</Typography></TableCell></TableRow>
                    ) : topItems.map((item: any, i) => (
                      <TableRow key={i} hover>
                        <TableCell><Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>{i + 1}</Box></TableCell>
                        <TableCell><Typography fontWeight={600}>{item.name}</Typography></TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right"><Typography fontWeight={600}>{formatCurrency(item.revenue)}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Low Stock Items</Typography>
              {lowStock.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>All stock levels are adequate</Typography>
              ) : lowStock.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.category}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="error.main" fontWeight={700}>{item.quantity} {item.unit}</Typography>
                    <Typography variant="caption" color="text.secondary">Min: {item.minStock}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
