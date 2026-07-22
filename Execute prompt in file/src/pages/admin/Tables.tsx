import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel,
  IconButton, Tooltip, Tab, Tabs,
} from '@mui/material';
import { Add, Edit, Delete, TableRestaurant, People } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { tableService } from '../../services/tableService';
import { orderService } from '../../services/orderService';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  available: { bg: '#27AE6015', text: '#27AE60', border: '#27AE60' },
  occupied: { bg: '#E74C3C15', text: '#E74C3C', border: '#E74C3C' },
  reserved: { bg: '#F39C1215', text: '#F39C12', border: '#F39C12' },
  cleaning: { bg: '#2980B915', text: '#2980B9', border: '#2980B9' },
};

const SECTIONS = ['Main Hall', 'Terrace', 'Private Room', 'Bar Area'];

export default function Tables() {
  const [tables, setTables] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sectionFilter, setSectionFilter] = useState('all');
  const [dialog, setDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [viewOrders, setViewOrders] = useState<any>(null);

  const { register, handleSubmit, reset, control } = useForm();

  const load = () => { setTables(tableService.getAll()); setOrders(orderService.getAll()); };
  useEffect(load, []);

  const sections = ['all', ...Array.from(new Set(tables.map((t) => t.section)))];
  const filtered = sectionFilter === 'all' ? tables : tables.filter((t) => t.section === sectionFilter);

  const openCreate = () => { setEditTarget(null); reset({ capacity: 4, status: 'available', section: 'Main Hall' }); setDialog(true); };
  const openEdit = (t: any) => { setEditTarget(t); reset(t); setDialog(true); };

  const onSubmit = (data: any) => {
    const payload = { ...data, number: parseInt(data.number), capacity: parseInt(data.capacity) };
    if (editTarget) tableService.update(editTarget.id, payload); else tableService.create(payload);
    load(); setDialog(false);
  };

  const handleStatusChange = (id: string, status: string) => { tableService.updateStatus(id, status); load(); };
  const getTableOrders = (tableId: string) => orders.filter((o) => o.tableId === tableId && !['completed', 'cancelled'].includes(o.status));

  const statusCounts = ['available', 'occupied', 'reserved', 'cleaning'].map((s) => ({ status: s, count: tables.filter((t) => t.status === s).length }));

  return (
    <AdminLayout>
      <PageHeader
        title="Restaurant Tables"
        subtitle={`${tables.length} tables managed`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Tables' }]}
        actions={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Table</Button>}
      />

      {/* Status Summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {statusCounts.map((s) => (
          <Box key={s.status} sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: STATUS_COLORS[s.status]?.bg, border: 1, borderColor: STATUS_COLORS[s.status]?.border }}>
            <Typography variant="h5" fontWeight={800} sx={{ color: STATUS_COLORS[s.status]?.text }}>{s.count}</Typography>
            <Typography variant="caption" sx={{ color: STATUS_COLORS[s.status]?.text, textTransform: 'capitalize', fontWeight: 600 }}>{s.status}</Typography>
          </Box>
        ))}
      </Box>

      {/* Section Filter */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {sections.map((s) => (
          <Chip key={s} label={s === 'all' ? 'All Sections' : s} onClick={() => setSectionFilter(s)} color={sectionFilter === s ? 'primary' : 'default'} variant={sectionFilter === s ? 'filled' : 'outlined'} />
        ))}
      </Box>

      {/* Table Grid */}
      <Grid container spacing={2}>
        {filtered.map((table) => {
          const tableOrders = getTableOrders(table.id);
          const colors = STATUS_COLORS[table.status] || STATUS_COLORS.available;
          return (
            <Grid key={table.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Card
                sx={{ border: 2, borderColor: colors.border, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}
                onClick={() => tableOrders.length > 0 && setViewOrders({ table, orders: tableOrders })}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <TableRestaurant sx={{ fontSize: 36, color: colors.text, mb: 1 }} />
                  <Typography variant="h5" fontWeight={800}>T{table.number}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                    <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{table.capacity} seats</Typography>
                  </Box>
                  <Chip label={table.status} size="small" sx={{ bgcolor: colors.bg, color: colors.text, fontWeight: 700, textTransform: 'capitalize', mb: 1 }} />
                  {tableOrders.length > 0 && <Typography variant="caption" display="block" color="text.secondary">{tableOrders.length} active order(s)</Typography>}
                  <Typography variant="caption" display="block" color="text.secondary">{table.section}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1 }} onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(table)}><Edit sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(table)}><Delete sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                  </Box>
                  {/* Quick status change */}
                  <Box sx={{ mt: 1 }} onClick={(e) => e.stopPropagation()}>
                    <FormControl size="small" fullWidth>
                      <Select value={table.status} onChange={(e) => handleStatusChange(table.id, e.target.value)} sx={{ fontSize: '0.7rem' }}>
                        {['available', 'occupied', 'reserved', 'cleaning'].map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem' }}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Table Form Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Table' : 'Add Table'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Table Number" type="number" {...register('number', { required: true })} />
            <TextField fullWidth label="Capacity (seats)" type="number" {...register('capacity', { required: true })} />
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Controller name="section" control={control} defaultValue="Main Hall" render={({ field }) => <Select {...field} label="Section">{SECTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select>} />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Controller name="status" control={control} defaultValue="available" render={({ field }) => <Select {...field} label="Status">{['available', 'occupied', 'reserved', 'cleaning'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select>} />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTarget ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Orders Dialog */}
      <Dialog open={!!viewOrders} onClose={() => setViewOrders(null)} maxWidth="sm" fullWidth>
        {viewOrders && (
          <>
            <DialogTitle>Table {viewOrders.table.number} — Active Orders</DialogTitle>
            <DialogContent>
              {viewOrders.orders.map((order: any) => (
                <Box key={order.id} sx={{ p: 2, mb: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography fontWeight={700}>{order.orderNumber}</Typography>
                    <Chip label={order.status} size="small" />
                  </Box>
                  {(order.items || []).map((item: any, i: number) => (
                    <Typography key={i} variant="body2" color="text.secondary">{item.name} x{item.quantity}</Typography>
                  ))}
                  <Typography fontWeight={700} sx={{ mt: 1 }}>Total: ${(order.total || 0).toFixed(2)}</Typography>
                </Box>
              ))}
            </DialogContent>
            <DialogActions><Button onClick={() => setViewOrders(null)}>Close</Button></DialogActions>
          </>
        )}
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title="Delete Table" message={`Delete Table ${deleteTarget?.number}?`} onConfirm={() => { tableService.delete(deleteTarget.id); load(); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
