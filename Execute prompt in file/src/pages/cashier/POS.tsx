import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, Button, TextField, Chip,
  Divider, Badge, Dialog, DialogTitle, DialogContent, DialogActions,
  ToggleButton, ToggleButtonGroup, InputAdornment, Paper, Avatar, Tooltip, MenuItem,
} from '@mui/material';
import {
  Add, Remove, Delete, Search, RestaurantMenu, LocalBar, PointOfSale,
  Receipt, CreditCard, PhoneAndroid, Money, CheckCircle,
} from '@mui/icons-material';
import CashierLayout from '../../layouts/CashierLayout';
import PageHeader from '../../components/common/PageHeader';
import { menuService } from '../../services/menuService';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { settingsService } from '../../services/settingsService';
import { inventoryService } from '../../services/inventoryService';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getMenuItemImage } from '../../data/menuImages';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POS() {
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [discount, setDiscount] = useState(0);
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [successDialog, setSuccessDialog] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    setCategories(menuService.getCategories());
    setMenuItems(menuService.getAvailableItems());
    setTables(tableService.getAvailable());
    setSettings(settingsService.get());
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchCat = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) return prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((c) => c.menuItemId === id ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0);
      return updated;
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.menuItemId !== id));
  const clearCart = () => { setCart([]); setDiscount(0); setSelectedTable(''); setCustomerName(''); };

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const taxRate = (settings.tax || 0) / 100;
  const taxAmount = subtotal * taxRate;
  const discountAmount = discount;
  const total = subtotal + taxAmount - discountAmount;

  const getCartQty = (id: string) => cart.find((c) => c.menuItemId === id)?.quantity || 0;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = orderService.create({
      items: cart,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      paymentMethod,
      status: 'pending',
      tableId: orderType === 'dine-in' ? selectedTable : undefined,
      customerName: customerName || 'Walk-in',
      type: orderType,
      cashierId: user?.id,
    });
    // Mark table as occupied
    if (orderType === 'dine-in' && selectedTable) tableService.updateStatus(selectedTable, 'occupied');
    setLastOrder(order);
    setSuccessDialog(true);
    addNotification(`Order ${order.orderNumber} placed successfully`, 'success');
    clearCart();
    setTables(tableService.getAvailable());
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '';

  return (
    <CashierLayout>
      <PageHeader title="Point of Sale" subtitle="Create and manage orders" breadcrumbs={[{ label: 'Cashier' }, { label: 'POS' }]} />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2, height: { xs: 'auto', lg: 'calc(100vh - 200px)' }, minHeight: { xs: 0, lg: 600 } }}>
        {/* LEFT — Menu */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          {/* Search */}
          <TextField
            size="small" placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          />

          {/* Category Tabs */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="All" onClick={() => setActiveCategory('all')} color={activeCategory === 'all' ? 'primary' : 'default'} variant={activeCategory === 'all' ? 'filled' : 'outlined'} />
            {categories.filter((c) => c.active).map((cat) => (
              <Chip key={cat.id} label={`${cat.icon || ''} ${cat.name}`} onClick={() => setActiveCategory(cat.id)} color={activeCategory === cat.id ? 'primary' : 'default'} variant={activeCategory === cat.id ? 'filled' : 'outlined'} />
            ))}
          </Box>

          {/* Menu Grid */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Grid container spacing={1.5}>
              {filteredItems.map((item) => {
                const qty = getCartQty(item.id);
                return (
                  <Grid key={item.id} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                    <Card
                      sx={{ cursor: 'pointer', border: qty > 0 ? 2 : 1, borderColor: qty > 0 ? 'primary.main' : 'divider', transition: 'all 0.15s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-1px)' }, position: 'relative' }}
                      onClick={() => addToCart(item)}
                    >
                      {qty > 0 && <Badge badgeContent={qty} color="primary" sx={{ position: 'absolute', top: 8, right: 8 }} />}
                      <Box sx={{ height: 80, bgcolor: item.type === 'drink' ? '#2980B915' : '#FF6B3515', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {getMenuItemImage(item) ? (
                          <Box component="img" src={getMenuItemImage(item)} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : item.type === 'drink' ? (
                          <LocalBar sx={{ fontSize: 32, color: '#2980B9', opacity: 0.7 }} />
                        ) : (
                          <RestaurantMenu sx={{ fontSize: 32, color: '#FF6B35', opacity: 0.7 }} />
                        )}
                      </Box>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">{getCategoryName(item.categoryId)}</Typography>
                        <Typography variant="body2" fontWeight={800} color="primary.main">{formatCurrency(item.price)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
              {filteredItems.length === 0 && (
                <Grid size={{ xs: 12 }}><Typography textAlign="center" color="text.secondary" py={6}>No items found</Typography></Grid>
              )}
            </Grid>
          </Box>
        </Box>

        {/* RIGHT — Cart */}
        <Box sx={{ width: { xs: '100%', lg: 360 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper sx={{ flex: 1, minHeight: { xs: 560, lg: 0 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={700}><PointOfSale sx={{ mr: 1, verticalAlign: 'middle' }} />Cart ({cart.length})</Typography>
                {cart.length > 0 && <Button size="small" color="error" onClick={clearCart}>Clear</Button>}
              </Box>
              {/* Order Type & Table */}
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <ToggleButtonGroup size="small" value={orderType} exclusive onChange={(_, v) => v && setOrderType(v)}>
                  <ToggleButton value="dine-in">Dine-In</ToggleButton>
                  <ToggleButton value="takeaway">Takeaway</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {orderType === 'dine-in' && (
                <TextField select size="small" fullWidth label="Table" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} sx={{ mt: 1 }}>
                  <MenuItem value="">No table</MenuItem>
                  {tables.map((t) => <MenuItem key={t.id} value={t.id}>Table {t.number} ({t.section})</MenuItem>)}
                </TextField>
              )}
              <TextField size="small" fullWidth label="Customer Name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} sx={{ mt: 1 }} />
            </Box>

            {/* Cart Items */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {cart.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.disabled' }}>
                  <RestaurantMenu sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body2">Tap items to add</Typography>
                </Box>
              ) : cart.map((item) => (
                <Box key={item.menuItemId} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  {getMenuItemImage(item) && (
                    <Box component="img" src={getMenuItemImage(item)} alt="" sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatCurrency(item.price)} each</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => updateQty(item.menuItemId, -1)}><Remove sx={{ fontSize: 14 }} /></IconButton>
                    <Typography variant="body2" fontWeight={700} sx={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQty(item.menuItemId, 1)}><Add sx={{ fontSize: 14 }} /></IconButton>
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ minWidth: 52, textAlign: 'right' }}>{formatCurrency(item.price * item.quantity)}</Typography>
                  <IconButton size="small" color="error" onClick={() => removeFromCart(item.menuItemId)}><Delete sx={{ fontSize: 14 }} /></IconButton>
                </Box>
              ))}
            </Box>

            {/* Totals */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Tax ({settings.tax || 0}%)</Typography>
                <Typography variant="body2">{formatCurrency(taxAmount)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Discount</Typography>
                <TextField size="small" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} inputProps={{ min: 0, step: 0.5 }} sx={{ width: 90 }} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>Total</Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">{formatCurrency(total)}</Typography>
              </Box>

              {/* Payment Method */}
              <Typography variant="caption" fontWeight={700} display="block" mb={1}>Payment Method</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, '& .MuiButton-root': { minWidth: { xs: 'calc(50% - 4px)', sm: 0 } } }}>
                {[
                  { value: 'cash', label: 'Cash', icon: <Money /> },
                  { value: 'card', label: 'Card', icon: <CreditCard /> },
                  { value: 'mobile', label: 'Mobile', icon: <PhoneAndroid /> },
                ].map((pm) => (
                  <Button key={pm.value} variant={paymentMethod === pm.value ? 'contained' : 'outlined'} size="small" startIcon={pm.icon} onClick={() => setPaymentMethod(pm.value as any)} sx={{ flex: 1 }}>
                    {pm.label}
                  </Button>
                ))}
              </Box>

              <Button fullWidth variant="contained" size="large" disabled={cart.length === 0} onClick={handleCheckout} startIcon={<CheckCircle />} sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}>
                Complete Order — {formatCurrency(total)}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={800} gutterBottom>Order Placed!</Typography>
          {lastOrder && (
            <>
              <Typography color="text.secondary">Order #{lastOrder.orderNumber}</Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>{formatCurrency(lastOrder.total)}</Typography>
              <Chip label={lastOrder.paymentMethod?.toUpperCase()} sx={{ mt: 1 }} />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={() => setSuccessDialog(false)}>New Order</Button>
        </DialogActions>
      </Dialog>
    </CashierLayout>
  );
}
