import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Card, CardContent, Typography, Chip, TextField, Tabs, Tab,
  InputAdornment, AppBar, Toolbar,
} from '@mui/material';
import { Search, Restaurant, LocalBar, RestaurantMenu } from '@mui/icons-material';
import { menuService } from '../../services/menuService';
import { settingsService } from '../../services/settingsService';
import { formatCurrency } from '../../utils/formatters';
import { getMenuItemImage } from '../../data/menuImages';

export default function QRMenu() {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCategories(menuService.getCategories().filter((c: any) => c.active));
    setItems(menuService.getAvailableItems());
    setSettings(settingsService.get());
  }, []);

  const allCategories = [{ id: 'all', name: 'All Items', icon: '🍽️' }, ...categories];
  const activeCategory = allCategories[activeTab];

  const filtered = items.filter((item) => {
    const matchCat = activeCategory.id === 'all' || item.categoryId === activeCategory.id;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#2C3E50' }}>
        <Toolbar sx={{ flexDirection: 'column', py: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Restaurant sx={{ color: '#FF6B35' }} />
            <Typography variant="h5" fontWeight={900} sx={{ color: 'white' }}>{settings.restaurantName}</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Digital Menu — Scan & Browse</Typography>
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <TextField
          fullWidth size="small" placeholder="Search dishes..." value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
        />
      </Container>

      {/* Category Tabs */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 64, zIndex: 10 }}>
        <Container maxWidth="lg">
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
            {allCategories.map((cat, i) => (
              <Tab key={cat.id} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Typography>{cat.icon || '🍽️'}</Typography><Typography variant="body2">{cat.name}</Typography></Box>} value={i} />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Menu Items */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No items found</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filtered.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }, transition: 'all 0.2s' }}>
                  <Box sx={{ height: 150, background: item.type === 'drink' ? 'linear-gradient(135deg, #2980B920, #2980B940)' : 'linear-gradient(135deg, #FF6B3520, #FF6B3540)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {getMenuItemImage(item) ? (
                      <Box component="img" src={getMenuItemImage(item)} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : item.type === 'drink' ? (
                      <LocalBar sx={{ fontSize: 56, color: '#2980B9', opacity: 0.5 }} />
                    ) : (
                      <RestaurantMenu sx={{ fontSize: 56, color: '#FF6B35', opacity: 0.5 }} />
                    )}
                  </Box>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={800} gutterBottom>{item.name}</Typography>
                    {item.description && <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, lineHeight: 1.4 }}>{item.description}</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h6" fontWeight={900} color="primary.main">{formatCurrency(item.price)}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Chip label={item.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        {item.preparationTime && <Chip label={`${item.preparationTime}m`} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Box sx={{ textAlign: 'center', py: 3, color: 'text.disabled' }}>
        <Typography variant="caption">Call us: {settings.phone} · {settings.address}</Typography>
      </Box>
    </Box>
  );
}
