import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { TableRestaurant, People, AddCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import WaiterLayout from '../../layouts/WaiterLayout';
import PageHeader from '../../components/common/PageHeader';
import { tableService } from '../../services/tableService';
import { orderService } from '../../services/orderService';

const STATUS_COLORS: Record<string, any> = {
  available: { bg: '#27AE6015', text: '#27AE60', border: '#27AE60' },
  occupied: { bg: '#E74C3C15', text: '#E74C3C', border: '#E74C3C' },
  reserved: { bg: '#F39C1215', text: '#F39C12', border: '#F39C12' },
  cleaning: { bg: '#2980B915', text: '#2980B9', border: '#2980B9' },
};

export default function WaiterTables() {
  const [tables, setTables] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => { setTables(tableService.getAll()); setOrders(orderService.getAll()); }, []);

  const getTableOrders = (id: string) => orders.filter((o) => o.tableId === id && !['completed', 'cancelled'].includes(o.status));

  return (
    <WaiterLayout>
      <PageHeader title="Tables" subtitle="Click a table to create or view its order" breadcrumbs={[{ label: 'Waiter' }, { label: 'Tables' }]} />
      <Grid container spacing={2}>
        {tables.map((table) => {
          const tableOrders = getTableOrders(table.id);
          const colors = STATUS_COLORS[table.status] || STATUS_COLORS.available;
          return (
            <Grid key={table.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Card sx={{ border: 2, borderColor: colors.border, cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }, transition: 'all 0.2s' }}
                onClick={() => table.status === 'available' ? navigate(`/waiter/create-order?tableId=${table.id}`) : undefined}>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <TableRestaurant sx={{ fontSize: 40, color: colors.text, mb: 1 }} />
                  <Typography variant="h5" fontWeight={800}>T{table.number}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                    <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{table.capacity}</Typography>
                  </Box>
                  <Chip label={table.status} size="small" sx={{ bgcolor: colors.bg, color: colors.text, fontWeight: 700, textTransform: 'capitalize' }} />
                  {tableOrders.length > 0 && <Typography variant="caption" display="block" sx={{ mt: 0.5, color: colors.text }}>{tableOrders.length} order(s)</Typography>}
                  <Typography variant="caption" color="text.secondary" display="block">{table.section}</Typography>
                  {table.status === 'available' && (
                    <Button size="small" variant="outlined" startIcon={<AddCircle />} sx={{ mt: 1, fontSize: '0.7rem' }} onClick={(e) => { e.stopPropagation(); navigate(`/waiter/create-order?tableId=${table.id}`); }}>
                      Order
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </WaiterLayout>
  );
}
