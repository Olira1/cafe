import { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Tooltip, TablePagination } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { supplierService } from '../../services/supplierService';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm();

  const load = () => setSuppliers(supplierService.getAll());
  useEffect(load, []);

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact?.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditTarget(null); reset({ status: 'active' }); setDialog(true); };
  const openEdit = (s: any) => { setEditTarget(s); reset(s); setDialog(true); };

  const onSubmit = (data: any) => {
    if (editTarget) supplierService.update(editTarget.id, data); else supplierService.create(data);
    load(); setDialog(false);
  };

  return (
    <AdminLayout>
      <PageHeader title="Suppliers" subtitle={`${suppliers.length} suppliers`} breadcrumbs={[{ label: 'Admin' }, { label: 'Suppliers' }]} actions={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Supplier</Button>} />

      <Box sx={{ mb: 3 }}>
        <TextField size="small" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 280 }} />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 10, (page + 1) * 10).length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No suppliers found" /></TableCell></TableRow>
              ) : filtered.slice(page * 10, (page + 1) * 10).map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
                  <TableCell>{s.contact}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell><Chip label={s.category} size="small" variant="outlined" /></TableCell>
                  <TableCell><Chip label={s.status} size="small" color={s.status === 'active' ? 'success' : 'default'} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(s)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(s)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Company Name" {...register('name', { required: true })} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Contact Person" {...register('contact')} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Email" type="email" {...register('email')} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Phone" {...register('phone')} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Category" {...register('category')} /></Grid>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Address" multiline rows={2} {...register('address')} /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTarget ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title="Delete Supplier" message={`Delete supplier "${deleteTarget?.name}"?`} onConfirm={() => { supplierService.delete(deleteTarget.id); load(); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
