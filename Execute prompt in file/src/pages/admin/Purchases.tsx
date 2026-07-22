import { useState, useEffect } from 'react';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField,
  MenuItem, Select, FormControl, InputLabel, Typography, Tooltip, TablePagination,
} from '@mui/material';
import { Add, Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import { purchaseService } from '../../services/purchaseService';
import { supplierService } from '../../services/supplierService';
import { inventoryService } from '../../services/inventoryService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const STATUS_COLORS: Record<string, any> = { pending: 'warning', received: 'success', cancelled: 'error' };

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [dialog, setDialog] = useState(false);
  const [viewPO, setViewPO] = useState<any>(null);
  const [page, setPage] = useState(0);

  const { register, handleSubmit, reset, control, watch } = useForm({ defaultValues: { supplierId: '', items: [{ inventoryId: '', quantity: 1, unitCost: 0 }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const load = () => { setPurchases(purchaseService.getAll()); setSuppliers(supplierService.getAll()); setInventory(inventoryService.getAll()); };
  useEffect(load, []);

  const onSubmit = (data: any) => {
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    const items = data.items.map((item: any) => {
      const inv = inventory.find((i) => i.id === item.inventoryId);
      return { ...item, quantity: parseFloat(item.quantity), unitCost: parseFloat(item.unitCost), name: inv?.name || '', unit: inv?.unit || '' };
    });
    const total = items.reduce((s: number, i: any) => s + i.quantity * i.unitCost, 0);
    purchaseService.create({ supplierId: data.supplierId, supplierName: supplier?.name || '', items, total, expectedDate: data.expectedDate });
    load(); setDialog(false); reset();
  };

  const handleReceive = (id: string) => { purchaseService.receive(id); load(); };
  const handleCancel = (id: string) => { purchaseService.cancel(id); load(); };

  return (
    <AdminLayout>
      <PageHeader title="Purchase Orders" subtitle={`${purchases.length} total POs`} breadcrumbs={[{ label: 'Admin' }, { label: 'Purchases' }]} actions={<Button variant="contained" startIcon={<Add />} onClick={() => { reset(); setDialog(true); }}>Create PO</Button>} />

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PO ID</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.slice(page * 10, (page + 1) * 10).map((po) => (
                <TableRow key={po.id} hover>
                  <TableCell><Typography fontWeight={600} variant="body2">{po.id.slice(-8).toUpperCase()}</Typography></TableCell>
                  <TableCell>{po.supplierName}</TableCell>
                  <TableCell>{(po.items || []).length} items</TableCell>
                  <TableCell><Typography fontWeight={700}>{formatCurrency(po.total || 0)}</Typography></TableCell>
                  <TableCell><Chip label={po.status} size="small" color={STATUS_COLORS[po.status] || 'default'} /></TableCell>
                  <TableCell><Typography variant="caption">{formatDateTime(po.createdAt)}</Typography></TableCell>
                  <TableCell align="right">
                    <Tooltip title="View"><IconButton size="small" onClick={() => setViewPO(po)}><Visibility fontSize="small" /></IconButton></Tooltip>
                    {po.status === 'pending' && <>
                      <Tooltip title="Mark Received"><IconButton size="small" color="success" onClick={() => handleReceive(po.id)}><CheckCircle fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Cancel"><IconButton size="small" color="error" onClick={() => handleCancel(po.id)}><Cancel fontSize="small" /></IconButton></Tooltip>
                    </>}
                  </TableCell>
                </TableRow>
              ))}
              {purchases.length === 0 && <TableRow><TableCell colSpan={7}><Typography textAlign="center" py={4} color="text.secondary">No purchase orders</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={purchases.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]} />
      </Paper>

      {/* Create PO Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Purchase Order</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Controller name="supplierId" control={control} rules={{ required: true }} defaultValue="" render={({ field }) => <Select {...field} label="Supplier">{suppliers.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}</Select>} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Expected Delivery" type="date" InputLabelProps={{ shrink: true }} {...register('expectedDate')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>Items</Typography>
                {fields.map((field, i) => (
                  <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <FormControl sx={{ flex: 2 }} size="small">
                      <InputLabel>Ingredient</InputLabel>
                      <Controller name={`items.${i}.inventoryId`} control={control} defaultValue="" render={({ field: f }) => <Select {...f} label="Ingredient">{inventory.map((inv) => <MenuItem key={inv.id} value={inv.id}>{inv.name}</MenuItem>)}</Select>} />
                    </FormControl>
                    <TextField size="small" label="Qty" type="number" sx={{ width: 80 }} {...register(`items.${i}.quantity`)} />
                    <TextField size="small" label="Unit Cost" type="number" sx={{ width: 100 }} {...register(`items.${i}.unitCost`)} />
                    <IconButton size="small" color="error" onClick={() => remove(i)}><Cancel fontSize="small" /></IconButton>
                  </Box>
                ))}
                <Button size="small" onClick={() => append({ inventoryId: '', quantity: 1, unitCost: 0 })}>+ Add Item</Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create PO</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View PO Dialog */}
      <Dialog open={!!viewPO} onClose={() => setViewPO(null)} maxWidth="sm" fullWidth>
        {viewPO && (
          <>
            <DialogTitle>PO Details — {viewPO.id.slice(-8).toUpperCase()}</DialogTitle>
            <DialogContent>
              <Typography><strong>Supplier:</strong> {viewPO.supplierName}</Typography>
              <Typography><strong>Status:</strong> {viewPO.status}</Typography>
              <Typography sx={{ mb: 2 }}><strong>Created:</strong> {formatDateTime(viewPO.createdAt)}</Typography>
              {(viewPO.items || []).map((item: any, i: number) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography>{item.name} x{item.quantity} {item.unit}</Typography>
                  <Typography fontWeight={600}>{formatCurrency(item.quantity * item.unitCost)}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography fontWeight={800}>Total</Typography>
                <Typography fontWeight={800}>{formatCurrency(viewPO.total || 0)}</Typography>
              </Box>
            </DialogContent>
            <DialogActions><Button onClick={() => setViewPO(null)}>Close</Button></DialogActions>
          </>
        )}
      </Dialog>
    </AdminLayout>
  );
}
