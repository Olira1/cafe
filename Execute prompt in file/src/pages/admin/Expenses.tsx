import { useState, useEffect } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, MenuItem, Select, FormControl, InputLabel, TablePagination } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { expenseService } from '../../services/expenseService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CATEGORIES = ['Rent', 'Salary', 'Utilities', 'Maintenance', 'Food Cost', 'Marketing', 'Equipment', 'Other'];
const CAT_COLORS: Record<string, string> = { Rent: '#E74C3C', Salary: '#2980B9', Utilities: '#F39C12', Maintenance: '#27AE60', 'Food Cost': '#FF6B35', Marketing: '#8E44AD', Equipment: '#16A085', Other: '#7F8C8D' };

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [catFilter, setCatFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { register, handleSubmit, reset, control } = useForm();

  const load = () => setExpenses(expenseService.getAll());
  useEffect(load, []);

  const filtered = catFilter === 'all' ? expenses : expenses.filter((e) => e.category === catFilter);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const openCreate = () => { setEditTarget(null); reset({ category: 'Rent', date: new Date().toISOString().split('T')[0] }); setDialog(true); };
  const openEdit = (e: any) => { setEditTarget(e); reset(e); setDialog(true); };

  const onSubmit = (data: any) => {
    const payload = { ...data, amount: parseFloat(data.amount) };
    if (editTarget) expenseService.update(editTarget.id, payload); else expenseService.create(payload);
    load(); setDialog(false);
  };

  return (
    <AdminLayout>
      <PageHeader title="Expense Reports" subtitle={`Total shown: ${formatCurrency(totalFiltered)}`} breadcrumbs={[{ label: 'Admin' }, { label: 'Expenses' }]} actions={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Expense</Button>} />

      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip label="All" onClick={() => setCatFilter('all')} color={catFilter === 'all' ? 'primary' : 'default'} variant={catFilter === 'all' ? 'filled' : 'outlined'} />
        {CATEGORIES.map((c) => <Chip key={c} label={c} onClick={() => setCatFilter(c)} color={catFilter === c ? 'primary' : 'default'} variant={catFilter === c ? 'filled' : 'outlined'} />)}
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Recurring</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 10, (page + 1) * 10).map((exp) => (
                <TableRow key={exp.id} hover>
                  <TableCell><Chip label={exp.category} size="small" sx={{ bgcolor: `${CAT_COLORS[exp.category]}20`, color: CAT_COLORS[exp.category], fontWeight: 700 }} /></TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>{exp.vendor || '-'}</TableCell>
                  <TableCell><Typography fontWeight={700}>{formatCurrency(exp.amount)}</Typography></TableCell>
                  <TableCell>{formatDate(exp.date)}</TableCell>
                  <TableCell><Chip label={exp.recurring ? 'Recurring' : 'One-time'} size="small" color={exp.recurring ? 'info' : 'default'} /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(exp)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(exp)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7}><Typography textAlign="center" py={4} color="text.secondary">No expenses found</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Controller name="category" control={control} defaultValue="Rent" render={({ field }) => <Select {...field} label="Category">{CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}</Select>} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Amount ($)" type="number" inputProps={{ step: '0.01' }} {...register('amount', { required: true })} /></Grid>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" {...register('description', { required: true })} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Vendor" {...register('vendor')} /></Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} {...register('date', { required: true })} /></Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Controller name="recurring" control={control} defaultValue={false} render={({ field }) => <Select {...field} label="Type" value={field.value ? 'true' : 'false'} onChange={(e) => field.onChange(e.target.value === 'true')}><MenuItem value="true">Recurring</MenuItem><MenuItem value="false">One-time</MenuItem></Select>} />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTarget ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title="Delete Expense" message={`Delete expense "${deleteTarget?.description}"?`} onConfirm={() => { expenseService.delete(deleteTarget.id); load(); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
