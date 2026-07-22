import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress } from '@mui/material';
import { Warning } from '@mui/icons-material';
import ChefLayout from '../../layouts/ChefLayout';
import PageHeader from '../../components/common/PageHeader';
import { inventoryService } from '../../services/inventoryService';
import EmptyState from '../../components/common/EmptyState';

export default function InventoryAlerts() {
  const [inventory, setInventory] = useState<any[]>([]);
  useEffect(() => { setInventory(inventoryService.getAll()); }, []);

  const lowStock = inventory.filter((i) => i.quantity <= i.minStock);
  const criticalStock = inventory.filter((i) => i.quantity === 0);

  return (
    <ChefLayout>
      <PageHeader title="Inventory Alerts" subtitle={`${lowStock.length} items need attention`} breadcrumbs={[{ label: 'Chef' }, { label: 'Inventory Alerts' }]} />

      {criticalStock.length > 0 && (
        <Card sx={{ border: 2, borderColor: 'error.main', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="error" gutterBottom>🚨 Out of Stock ({criticalStock.length})</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{criticalStock.map((i) => <Chip key={i.id} label={i.name} color="error" />)}</Box>
          </CardContent>
        </Card>
      )}

      {lowStock.length === 0 ? (
        <EmptyState title="All stock levels are adequate" description="No inventory alerts at this time." />
      ) : lowStock.map((item) => {
        const pct = item.minStock > 0 ? Math.min(100, (item.quantity / item.minStock) * 100) : 0;
        return (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" fontSize="small" />
                  <Typography fontWeight={700}>{item.name}</Typography>
                  <Chip label={item.category} size="small" variant="outlined" />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography color="error.main" fontWeight={700}>{item.quantity} {item.unit}</Typography>
                  <Typography variant="caption" color="text.secondary">Min: {item.minStock} {item.unit}</Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={pct} color={item.quantity === 0 ? 'error' : 'warning'} sx={{ borderRadius: 4, height: 8 }} />
            </CardContent>
          </Card>
        );
      })}
    </ChefLayout>
  );
}
