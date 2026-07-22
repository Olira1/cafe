import { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TablePagination, MenuItem, Select, FormControl, InputLabel, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, Warning } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { inventoryService } from '../../services/inventoryService';
import { supplierService } from '../../services/supplierService';
import { formatDate, formatCurrency } from '../../utils/formatters';

const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'box', 'bag', 'dozen'];
const CATEGORIES = ['Meat', 'Seafood', 'Dairy', 'Produce', 'Dry Goods', 'Oils', 'Baking', 'Beverages', 'Other'];

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { register, handleSubmit, reset, control } = useForm();

  const load = () => { setItems(inventoryService.getAll()); setSuppliers(supplierService.getAll()); };
  useEffect(load, []);

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || i.category === catFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'low' && i.quantity <= i.minStock) || (stockFilter === 'ok' && i.quantity > i.minStock);
    return matchSearch && matchCat && matchStock;
  });

  const openCreate = () => { setEditTarget(null); reset({}); setDialog(true); };
  const openEdit = (item: any) => { setEditTarget(item); reset(item); setDialog(true); };

  const onSubmit = (data: any) => {
    const payload = { ...data, quantity: parseFloat(data.quantity), minStock: parseFloat(data.minStock), costPerUnit: parseFloat(data.costPerUnit) };
    if (editTarget) inventoryService.update(editTarget.id, payload); else inventoryService.create(payload);
    load(); setDialog(false);
  };

  const handleDelete = () => { if (deleteTarget) { inventoryService.delete(deleteTarget.id); load(); setDeleteTarget(null); } };
  const getSupplierName = (id: string) => suppliers.find((s) => s.id === id)?.name || '-';

  const lowStockCount = items.filter((i) => i.quantity <= i.minStock).length;

  return (
    <AdminLayout>
      <PageHeader
        title="Inventory"
        subtitle={`${items.length} ingredients tracked${lowStockCount > 0 ? ` • ${lowStockCount} low stock` : ''}`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Inventory' }]}
        actions={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Item</Button>}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 220 }} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select value={catFilter} label="Category" onChange={(e) => setCatFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Stock Level</InputLabel>
          <Select value={stockFilter} label="Stock Level" onChange={(e) => setStockFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="low">Low Stock</MenuItem>
            <MenuItem value="ok">Adequate</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ingredient</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Min Stock</TableCell>
                <TableCell>Cost/Unit</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 10, (page + 1) * 10).length === 0 ? (
                <TableRow><TableCell colSpan={9}><EmptyState title="No inventory items" /></TableCell></TableRow>
              ) : filtered.slice(page * 10, (page + 1) * 10).map((item) => {
                const isLow = item.quantity <= item.minStock;
                return (
                  <TableRow key={item.id} hover sx={{ bgcolor: isLow ? 'error.light' + '10' : undefined }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isLow && <Warning sx={{ fontSize: 16, color: 'error.main' }} />}
                        <Box sx={{ fontWeight: 600 }}>{item.name}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Box sx={{ fontWeight: 700, color: isLow ? 'error.main' : 'text.primary' }}>
                        {item.quantity} {item.unit}
                      </Box>
                    </TableCell>
                    <TableCell>{item.minStock} {item.unit}</TableCell>
                    <TableCell>{formatCurrency(item.costPerUnit)}</TableCell>
                    <TableCell>{getSupplierName(item.supplierId)}</TableCell>
                    <TableCell>{formatDate(item.expiryDate)}</TableCell>
                    <TableCell>
                      <Chip label={isLow ? 'Low Stock' : 'OK'} size="small" color={isLow ? 'error' : 'success'} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(item)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(item)}><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Ingredient Name" {...register('name', { required: true })} /></Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Controller name="category" control={control} defaultValue="" render={({ field }) => <Select {...field} label="Category">{CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}</Select>} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Controller name="unit" control={control} defaultValue="kg" render={({ field }) => <Select {...field} label="Unit">{UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}</Select>} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 4 }}><TextField fullWidth label="Quantity" type="number" inputProps={{ step: '0.1' }} {...register('quantity', { required: true })} /></Grid>
              <Grid size={{ xs: 4 }}><TextField fullWidth label="Min Stock" type="number" inputProps={{ step: '0.1' }} {...register('minStock', { required: true })} /></Grid>
              <Grid size={{ xs: 4 }}><TextField fullWidth label="Cost/Unit ($)" type="number" inputProps={{ step: '0.01' }} {...register('costPerUnit')} /></Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Controller name="supplierId" control={control} defaultValue="" render={({ field }) => <Select {...field} label="Supplier"><MenuItem value="">None</MenuItem>{suppliers.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}</Select>} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}><TextField fullWidth label="Expiry Date" type="date" InputLabelProps={{ shrink: true }} {...register('expiryDate')} /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTarget ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title="Delete Item" message={`Delete "${deleteTarget?.name}" from inventory?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
