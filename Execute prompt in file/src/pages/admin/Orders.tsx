import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Typography, TextField, MenuItem, Select, FormControl, InputLabel,
  TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, List,
  ListItem, ListItemText,
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const STATUS_COLORS: Record<string, any> = {
  pending: 'warning', cooking: 'info', ready: 'secondary', served: 'primary', completed: 'success', cancelled: 'error',
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [viewOrder, setViewOrder] = useState<any>(null);

  const load = () => { setOrders(orderService.getAll()); setTables(tableService.getAll()); };
  useEffect(load, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber?.includes(search) || o.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getTableNumber = (id: string) => tables.find((t) => t.id === id)?.number || '-';

  const handleUpdateStatus = (id: string, status: string) => {
    orderService.updateStatus(id, status);
    load();
    if (viewOrder?.id === id) setViewOrder({ ...viewOrder, status });
  };

  const STATUSES = ['pending', 'cooking', 'ready', 'served', 'completed', 'cancelled'];
  const NEXT_STATUS: Record<string, string> = { pending: 'cooking', cooking: 'ready', ready: 'served', served: 'completed' };

  return (
    <AdminLayout>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Orders' }]}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search order #, customer..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 240 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 10, (page + 1) * 10).length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState title="No orders found" /></TableCell></TableRow>
              ) : filtered.slice(page * 10, (page + 1) * 10).map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell><Typography fontWeight={700} variant="body2">{order.orderNumber}</Typography></TableCell>
                  <TableCell>{order.tableId ? `Table ${getTableNumber(order.tableId)}` : order.type === 'takeaway' ? 'Takeaway' : '-'}</TableCell>
                  <TableCell>{order.customerName || 'Walk-in'}</TableCell>
                  <TableCell>{(order.items || []).length} items</TableCell>
                  <TableCell><Typography fontWeight={700}>{formatCurrency(order.total || 0)}</Typography></TableCell>
                  <TableCell><Chip label={order.status} size="small" color={STATUS_COLORS[order.status] || 'default'} /></TableCell>
                  <TableCell><Typography variant="caption">{formatDateTime(order.createdAt)}</Typography></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setViewOrder(order)}><Visibility fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth>
        {viewOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Order {viewOrder.orderNumber}
                <Chip label={viewOrder.status} color={STATUS_COLORS[viewOrder.status] || 'default'} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Placed: {formatDateTime(viewOrder.createdAt)}</Typography>
                {viewOrder.tableId && <Typography variant="body2">Table: {getTableNumber(viewOrder.tableId)}</Typography>}
                {viewOrder.customerName && <Typography variant="body2">Customer: {viewOrder.customerName}</Typography>}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {(viewOrder.items || []).map((item: any, i: number) => (
                  <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText primary={item.name} secondary={`x${item.quantity}`} />
                    <Typography fontWeight={600}>{formatCurrency(item.price * item.quantity)}</Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal</Typography><Typography>{formatCurrency(viewOrder.subtotal || 0)}</Typography>
              </Box>
              {viewOrder.tax > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Tax</Typography><Typography>{formatCurrency(viewOrder.tax || 0)}</Typography>
              </Box>}
              {viewOrder.discount > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Discount</Typography><Typography color="success.main">-{formatCurrency(viewOrder.discount || 0)}</Typography>
              </Box>}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography fontWeight={800} variant="h6">Total</Typography><Typography fontWeight={800} variant="h6">{formatCurrency(viewOrder.total || 0)}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewOrder(null)}>Close</Button>
              {NEXT_STATUS[viewOrder.status] && (
                <Button variant="contained" onClick={() => { handleUpdateStatus(viewOrder.id, NEXT_STATUS[viewOrder.status]); setViewOrder({ ...viewOrder, status: NEXT_STATUS[viewOrder.status] }); }}>
                  Move to {NEXT_STATUS[viewOrder.status].charAt(0).toUpperCase() + NEXT_STATUS[viewOrder.status].slice(1)}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </AdminLayout>
  );
}
