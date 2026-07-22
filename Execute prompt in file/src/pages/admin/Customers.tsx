import { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Chip, TablePagination, Tooltip } from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { customerService } from '../../services/customerService';
import { menuService } from '../../services/menuService';
import { formatCurrency, formatDate, getInitials } from '../../utils/formatters';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [viewCustomer, setViewCustomer] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm();

  const load = () => { setCustomers(customerService.getAll()); setMenuItems(menuService.getItems()); };
  useEffect(load, []);

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search));

  const openCreate = () => { setEditTarget(null); reset({}); setDialog(true); };
  const openEdit = (c: any) => { setEditTarget(c); reset(c); setDialog(true); };

  const onSubmit = (data: any) => {
    if (editTarget) customerService.update(editTarget.id, data); else customerService.create(data);
    load(); setDialog(false);
  };

  const getItemName = (id: string) => menuItems.find((m) => m.id === id)?.name || id;

  return (
    <AdminLayout>
      <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} breadcrumbs={[{ label: 'Admin' }, { label: 'Customers' }]} actions={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Customer</Button>} />

      <Box sx={{ mb: 3 }}>
        <TextField size="small" placeholder="Search by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 300 }} />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Total Orders</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 10, (page + 1) * 10).length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No customers found" /></TableCell></TableRow>
              ) : filtered.slice(page * 10, (page + 1) * 10).map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.75rem' }}>{getInitials(c.name)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{c.phone || '-'}</TableCell>
                  <TableCell>{formatDate(c.joinDate)}</TableCell>
                  <TableCell>{c.totalOrders || 0}</TableCell>
                  <TableCell><Typography fontWeight={600}>{formatCurrency(c.totalSpent || 0)}</Typography></TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">{c.notes || '-'}</Typography></TableCell>
                  <TableCell align="right">
                    <Tooltip title="View History"><IconButton size="small" onClick={() => setViewCustomer(c)}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(c)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(c)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" {...register('name', { required: true })} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Email" type="email" {...register('email')} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Phone" {...register('phone')} /></Grid>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Notes (allergies, preferences)" multiline rows={2} {...register('notes')} /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTarget ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={!!viewCustomer} onClose={() => setViewCustomer(null)} maxWidth="xs" fullWidth>
        {viewCustomer && (
          <>
            <DialogTitle>{viewCustomer.name} — Profile</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, fontSize: '1.2rem', mx: 'auto', mb: 1 }}>{getInitials(viewCustomer.name)}</Avatar>
                <Typography fontWeight={700}>{viewCustomer.name}</Typography>
                <Typography variant="body2" color="text.secondary">{viewCustomer.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}><Typography variant="h5" fontWeight={800}>{viewCustomer.totalOrders || 0}</Typography><Typography variant="caption" color="text.secondary">Orders</Typography></Box>
                <Box sx={{ textAlign: 'center' }}><Typography variant="h5" fontWeight={800}>{formatCurrency(viewCustomer.totalSpent || 0)}</Typography><Typography variant="caption" color="text.secondary">Total Spent</Typography></Box>
              </Box>
              {(viewCustomer.favoriteItems || []).length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>Favorite Items</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {viewCustomer.favoriteItems.map((id: string) => <Chip key={id} label={getItemName(id)} size="small" />)}
                  </Box>
                </Box>
              )}
              {viewCustomer.notes && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Note: {viewCustomer.notes}</Typography>}
            </DialogContent>
            <DialogActions><Button onClick={() => setViewCustomer(null)}>Close</Button></DialogActions>
          </>
        )}
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title="Delete Customer" message={`Delete customer "${deleteTarget?.name}"?`} onConfirm={() => { customerService.delete(deleteTarget.id); load(); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
