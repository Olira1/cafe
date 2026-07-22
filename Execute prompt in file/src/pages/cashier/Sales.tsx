import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CashierLayout from '../../layouts/CashierLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import { AttachMoney, Receipt, TrendingUp } from '@mui/icons-material';

export default function CashierSales() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { setOrders(orderService.getAll()); }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCompleted = orders.filter((o) => o.status === 'completed' && new Date(o.createdAt) >= today);
  const todayRevenue = todayCompleted.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = todayCompleted.length ? todayRevenue / todayCompleted.length : 0;

  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    const start = new Date(today); start.setHours(hour, 0, 0, 0);
    const end = new Date(today); end.setHours(hour + 1, 0, 0, 0);
    const rev = todayCompleted.filter((o) => { const d = new Date(o.createdAt); return d >= start && d < end; }).reduce((s, o) => s + (o.total || 0), 0);
    return { hour: `${hour}:00`, revenue: parseFloat(rev.toFixed(2)) };
  });

  const pmSales = { cash: 0, card: 0, mobile: 0 };
  todayCompleted.forEach((o) => { if (o.paymentMethod in pmSales) pmSales[o.paymentMethod as keyof typeof pmSales] += o.total || 0; });

  return (
    <CashierLayout>
      <PageHeader title="Today's Sales" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} breadcrumbs={[{ label: 'Cashier' }, { label: "Today's Sales" }]} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Today's Revenue" value={formatCurrency(todayRevenue)} icon={<AttachMoney />} color="#27AE60" /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Completed Orders" value={todayCompleted.length} icon={<Receipt />} color="#FF6B35" /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Average Order" value={formatCurrency(avgOrder)} icon={<TrendingUp />} color="#2980B9" /></Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Hourly Revenue</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => formatCurrency(v)} />
                  <Bar dataKey="revenue" fill="#2980B9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Payment Methods</Typography>
              {Object.entries(pmSales).map(([method, amount]) => (
                <Box key={method} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography textTransform="capitalize">{method}</Typography>
                  <Typography fontWeight={700}>{formatCurrency(amount)}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CashierLayout>
  );
}
