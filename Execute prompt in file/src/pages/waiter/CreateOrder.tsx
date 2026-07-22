import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, TextField, IconButton, Divider, Alert } from '@mui/material';
import { Add, Remove, Delete, Send, RestaurantMenu, LocalBar } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WaiterLayout from '../../layouts/WaiterLayout';
import PageHeader from '../../components/common/PageHeader';
import { menuService } from '../../services/menuService';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { settingsService } from '../../services/settingsService';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export default function CreateOrder() {
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<any>({});

  const [params] = useSearchParams();
  const tableId = params.get('tableId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    setCategories(menuService.getCategories());
    setMenuItems(menuService.getAvailableItems());
    setSettings(settingsService.get());
  }, []);

  const [table, setTable] = useState<any>(null);
  useEffect(() => { if (tableId) setTable(tableService.getById(tableId)); }, [tableId]);

  const filtered = menuItems.filter((i) => {
    const matchCat = activeCat === 'all' || i.categoryId === activeCat;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (item: any) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.menuItemId === item.id);
      if (ex) return prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => setCart((prev) => prev.map((c) => c.menuItemId === id ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));
  const getCartQty = (id: string) => cart.find((c) => c.menuItemId === id)?.quantity || 0;

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const tax = subtotal * ((settings.tax || 0) / 100);
  const total = subtotal + tax;

  const handleSendToKitchen = () => {
    if (cart.length === 0) return;
    const order = orderService.create({
      items: cart, subtotal, tax, discount: 0, total,
      tableId: tableId || undefined,
      status: 'pending',
      type: tableId ? 'dine-in' : 'takeaway',
      waiterId: user?.id,
      notes,
    });
    if (tableId) tableService.updateStatus(tableId, 'occupied');
    addNotification(`Order ${order.orderNumber} sent to kitchen`, 'success');
    setSuccess(order.orderNumber);
    setCart([]);
    setNotes('');
    setTimeout(() => navigate('/waiter/orders'), 2000);
  };

  return (
    <WaiterLayout>
      <PageHeader
        title={table ? `Order — Table ${table.number}` : 'Create Order'}
        subtitle={table ? `${table.section} · ${table.capacity} seats` : 'New order'}
        breadcrumbs={[{ label: 'Waiter' }, { label: 'Create Order' }]}
      />

      {success && <Alert severity="success" sx={{ mb: 2 }}>Order {success} sent to kitchen! Redirecting...</Alert>}

      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 220px)', minHeight: 500 }}>
        {/* Menu */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField size="small" placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="All" onClick={() => setActiveCat('all')} color={activeCat === 'all' ? 'primary' : 'default'} variant={activeCat === 'all' ? 'filled' : 'outlined'} />
            {categories.filter((c) => c.active).map((c) => <Chip key={c.id} label={c.name} onClick={() => setActiveCat(c.id)} color={activeCat === c.id ? 'primary' : 'default'} variant={activeCat === c.id ? 'filled' : 'outlined'} />)}
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Grid container spacing={1.5}>
              {filtered.map((item) => {
                const qty = getCartQty(item.id);
                return (
                  <Grid key={item.id} size={{ xs: 6, sm: 4 }}>
                    <Card sx={{ cursor: 'pointer', border: qty > 0 ? 2 : 1, borderColor: qty > 0 ? 'primary.main' : 'divider', '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s' }} onClick={() => addToCart(item)}>
                      <Box sx={{ height: 70, bgcolor: item.type === 'drink' ? '#2980B915' : '#FF6B3515', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.type === 'drink' ? <LocalBar sx={{ fontSize: 28, color: '#2980B9', opacity: 0.7 }} /> : <RestaurantMenu sx={{ fontSize: 28, color: '#FF6B35', opacity: 0.7 }} />}
                      </Box>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{item.name}</Typography>
                        <Typography variant="body2" fontWeight={800} color="primary.main">{formatCurrency(item.price)}</Typography>
                        {qty > 0 && <Chip label={`x${qty}`} size="small" color="primary" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }} />}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>

        {/* Cart */}
        <Box sx={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700}>Order Summary ({cart.length})</Typography>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {cart.length === 0 ? <Typography textAlign="center" color="text.secondary" py={4} variant="body2">Add items from menu</Typography> : cart.map((item) => (
                <Box key={item.menuItemId} sx={{ display: 'flex', alignItems: 'center', py: 0.75, gap: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatCurrency(item.price)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => updateQty(item.menuItemId, -1)}><Remove sx={{ fontSize: 12 }} /></IconButton>
                    <Typography variant="body2" fontWeight={700}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQty(item.menuItemId, 1)}><Add sx={{ fontSize: 12 }} /></IconButton>
                  </Box>
                  <Typography variant="caption" fontWeight={700}>{formatCurrency(item.price * item.quantity)}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TextField size="small" fullWidth label="Notes for kitchen" multiline rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Tax</Typography>
                <Typography variant="body2">{formatCurrency(tax)}</Typography>
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontWeight={800}>Total</Typography>
                <Typography fontWeight={800} color="primary.main">{formatCurrency(total)}</Typography>
              </Box>
              <Button fullWidth variant="contained" startIcon={<Send />} disabled={cart.length === 0} onClick={handleSendToKitchen} color="success">
                Send to Kitchen
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </WaiterLayout>
  );
}
