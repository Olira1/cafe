import { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Avatar, IconButton, TextField, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, TablePagination, Tooltip,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Search, ToggleOn, ToggleOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { employeeService } from '../../services/employeeService';
import { getInitials, formatDate, formatCurrency } from '../../utils/formatters';

const ROLES = ['admin', 'cashier', 'chef', 'waiter'];
const ROLE_COLORS: Record<string, string> = { admin: '#FF6B35', cashier: '#2980B9', chef: '#27AE60', waiter: '#8E44AD' };

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const load = () => setEmployees(employeeService.getEmployees());
  useEffect(load, []);

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || e.role === roleFilter;
    return matchSearch && matchRole;
  });

  const paginated = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const openCreate = () => { setEditTarget(null); reset({}); setError(''); setDialogOpen(true); };
  const openEdit = (emp: any) => { setEditTarget(emp); reset(emp); setError(''); setDialogOpen(true); };

  const onSubmit = (data: any) => {
    try {
      if (editTarget) { employeeService.update(editTarget.id, data); }
      else { employeeService.create(data); }
      load();
      setDialogOpen(false);
    } catch (e: any) { setError(e.message); }
  };

  const handleDelete = () => { if (deleteTarget) { employeeService.delete(deleteTarget.id); load(); setDeleteTarget(null); } };
  const handleToggle = (id: string) => { employeeService.toggleStatus(id); load(); };

  return (
    <AdminLayout>
      <PageHeader
        title="Employee Management"
        subtitle={`${employees.length} total employees`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Employees' }]}
        actions={<Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Employee</Button>}
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 250 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
            <MenuItem value="all">All Roles</MenuItem>
            {ROLES.map((r) => <MenuItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No employees found" /></TableCell></TableRow>
              ) : paginated.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: ROLE_COLORS[emp.role] || '#999', width: 36, height: 36, fontSize: '0.75rem' }}>{getInitials(emp.name)}</Avatar>
                      <Box>
                        <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</Box>
                        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{emp.email}</Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={emp.role} size="small" sx={{ bgcolor: `${ROLE_COLORS[emp.role]}20`, color: ROLE_COLORS[emp.role], fontWeight: 700, textTransform: 'capitalize' }} /></TableCell>
                  <TableCell>{emp.phone || '-'}</TableCell>
                  <TableCell>{emp.salary ? formatCurrency(emp.salary) : '-'}</TableCell>
                  <TableCell>{formatDate(emp.joinDate)}</TableCell>
                  <TableCell><Chip label={emp.status} size="small" color={emp.status === 'active' ? 'success' : 'default'} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title={emp.status === 'active' ? 'Deactivate' : 'Activate'}>
                      <IconButton size="small" onClick={() => handleToggle(emp.id)} color={emp.status === 'active' ? 'success' : 'default'}>
                        {emp.status === 'active' ? <ToggleOn /> : <ToggleOff />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(emp)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(emp)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} rowsPerPageOptions={[10]} />
      </Paper>

      {/* Employee Form Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Full Name" {...register('name', { required: 'Required' })} error={!!errors.name} helperText={errors.name?.message as string} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Required' })} error={!!errors.email} helperText={errors.email?.message as string} />
              </Grid>
              {!editTarget && (
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Password" type="password" {...register('password', { required: 'Required' })} error={!!errors.password} helperText={errors.password?.message as string} />
                </Grid>
              )}
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Controller name="role" control={control} rules={{ required: 'Required' }} defaultValue=""
                    render={({ field }) => (
                      <Select {...field} label="Role">
                        {ROLES.map((r) => <MenuItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</MenuItem>)}
                      </Select>
                    )} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Phone" {...register('phone')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Salary" type="number" {...register('salary')} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Join Date" type="date" InputLabelProps={{ shrink: true }} {...register('joinDate')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Controller name="status" control={control} defaultValue="active"
                    render={({ field }) => (
                      <Select {...field} label="Status">
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    )} />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editTarget ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title="Delete Employee" message={`Are you sure you want to delete ${deleteTarget?.name}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
