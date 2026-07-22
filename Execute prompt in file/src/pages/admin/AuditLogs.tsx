import { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, TextField, TablePagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import { auditService } from '../../services/auditService';
import { formatDateTime } from '../../utils/formatters';

const ACTION_COLORS: Record<string, any> = { LOGIN: 'info', LOGOUT: 'default', CREATE: 'success', UPDATE: 'warning', DELETE: 'error' };

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => { setLogs(auditService.getAll()); }, []);

  const filtered = logs.filter((l) => l.description?.toLowerCase().includes(search.toLowerCase()) || l.action?.includes(search.toUpperCase()));

  return (
    <AdminLayout>
      <PageHeader title="Audit Logs" subtitle={`${logs.length} total events`} breadcrumbs={[{ label: 'Admin' }, { label: 'Audit Logs' }]} />

      <Box sx={{ mb: 3 }}>
        <TextField size="small" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 300 }} />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * 25, (page + 1) * 25).map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell><Chip label={log.action} size="small" color={ACTION_COLORS[log.action] || 'default'} /></TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">{log.userId || '-'}</Typography></TableCell>
                  <TableCell><Typography variant="caption">{formatDateTime(log.timestamp)}</Typography></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={4}><Typography textAlign="center" py={4} color="text.secondary">No audit logs found</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={25} rowsPerPageOptions={[25]} />
      </Paper>
    </AdminLayout>
  );
}
