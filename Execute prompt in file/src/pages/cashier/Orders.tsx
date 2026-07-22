import { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, MenuItem, Select, FormControl, InputLabel, Typography, TablePagination, Button } from '@mui/material';
import CashierLayout from '../../layouts/CashierLayout';
import PageHeader from '../../components/common/PageHeader';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const STATUS_COLORS: Record<string, any> = { pending: 'warning', cooking: 'info', ready: 'secondary', served: 'primary', completed: 'success', cancelled: 'error' };

export default function CashierOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const load = () => setOrders(orderService.getAll());
  useEffect(load, []);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = o.orderNumber?.includes(search) || o.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleComplete = (id: string) => { orderService.updateStatus(id, 'completed'); load(); };

  return (
    <CashierLayout>
      <PageHeader title="Orders" subtitle={`${orders.length} total orders`} breadcrumbs={[{ label: 'Cashier' }, { label: 'Orders' }]} />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 220 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {['pending', 'cooking', 'ready', 'served', 'completed', 'cancelled'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 10, (page + 1) * 10).map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell><Typography fontWeight={700} variant="body2">{order.orderNumber}</Typography></TableCell>
                  <TableCell>{order.customerName || 'Walk-in'}</TableCell>
                  <TableCell><Chip label={order.type || 'dine-in'} size="small" variant="outlined" /></TableCell>
                  <TableCell>{order.paymentMethod || '-'}</TableCell>
                  <TableCell><Typography fontWeight={700}>{formatCurrency(order.total || 0)}</Typography></TableCell>
                  <TableCell><Chip label={order.status} size="small" color={STATUS_COLORS[order.status]} /></TableCell>
                  <TableCell><Typography variant="caption">{formatDateTime(order.createdAt)}</Typography></TableCell>
                  <TableCell align="right">
                    {order.status === 'served' && <Button size="small" variant="contained" color="success" onClick={() => handleComplete(order.id)}>Complete</Button>}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8}><Typography textAlign="center" py={4} color="text.secondary">No orders found</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>
    </CashierLayout>
  );
}
