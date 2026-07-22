import { useState, useEffect } from 'react';
import {
  Box, Button, Grid, Card, CardContent, CardMedia, Typography, Chip, IconButton,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tab, Tabs,
  MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, Avatar, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, RestaurantMenu, LocalBar } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { menuService } from '../../services/menuService';
import { formatCurrency } from '../../utils/formatters';

export default function MenuManagement() {
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [catDialog, setCatDialog] = useState(false);
  const [itemDialog, setItemDialog] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteType, setDeleteType] = useState('');

  const catForm = useForm();
  const itemForm = useForm();

  const load = () => { setCategories(menuService.getCategories()); setItems(menuService.getItems()); };
  useEffect(load, []);

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || item.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  const openCatCreate = () => { setEditCat(null); catForm.reset({ active: true }); setCatDialog(true); };
  const openCatEdit = (c: any) => { setEditCat(c); catForm.reset(c); setCatDialog(true); };
  const onCatSubmit = (data: any) => {
    if (editCat) menuService.updateCategory(editCat.id, data); else menuService.createCategory(data);
    load(); setCatDialog(false);
  };

  const openItemCreate = () => { setEditItem(null); itemForm.reset({ available: true, type: 'food', price: '' }); setItemDialog(true); };
  const openItemEdit = (item: any) => { setEditItem(item); itemForm.reset(item); setItemDialog(true); };
  const onItemSubmit = (data: any) => {
    const payload = { ...data, price: parseFloat(data.price) };
    if (editItem) menuService.updateItem(editItem.id, payload); else menuService.createItem(payload);
    load(); setItemDialog(false);
  };

  const handleDelete = () => {
    if (deleteType === 'category') menuService.deleteCategory(deleteTarget.id);
    else menuService.deleteItem(deleteTarget.id);
    load(); setDeleteTarget(null);
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '-';

  return (
    <AdminLayout>
      <PageHeader
        title="Menu Management"
        subtitle={`${items.length} items across ${categories.length} categories`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Menu Management' }]}
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Menu Items" />
        <Tab label="Categories" />
      </Tabs>

      {/* Menu Items Tab */}
      {tab === 0 && (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }} sx={{ minWidth: 220 }} />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Category</InputLabel>
                <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" startIcon={<Add />} onClick={openItemCreate}>Add Item</Button>
          </Box>

          {filteredItems.length === 0 ? (
            <EmptyState title="No menu items found" action={{ label: 'Add First Item', onClick: openItemCreate }} />
          ) : (
            <Grid container spacing={2}>
              {filteredItems.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: 140, bgcolor: item.type === 'drink' ? '#2980B920' : '#FF6B3520', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.type === 'drink' ? <LocalBar sx={{ fontSize: 56, color: '#2980B9', opacity: 0.6 }} /> : <RestaurantMenu sx={{ fontSize: 56, color: '#FF6B35', opacity: 0.6 }} />}
                    </Box>
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>{item.name}</Typography>
                        <Chip label={item.available ? 'Available' : 'Unavailable'} size="small" color={item.available ? 'success' : 'default'} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>{getCategoryName(item.categoryId)}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>{item.description}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight={800} color="primary.main">{formatCurrency(item.price)}</Typography>
                        <Box>
                          <IconButton size="small" onClick={() => openItemEdit(item)}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => { setDeleteTarget(item); setDeleteType('item'); }}><Delete fontSize="small" /></IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Categories Tab */}
      {tab === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button variant="contained" startIcon={<Add />} onClick={openCatCreate}>Add Category</Button>
          </Box>
          <Grid container spacing={2}>
            {categories.map((cat) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography fontSize={32}>{cat.icon || '🍽️'}</Typography>
                        <Box>
                          <Typography fontWeight={700}>{cat.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{items.filter((i) => i.categoryId === cat.id).length} items</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={cat.active ? 'Active' : 'Inactive'} size="small" color={cat.active ? 'success' : 'default'} />
                        <IconButton size="small" onClick={() => openCatEdit(cat)}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => { setDeleteTarget(cat); setDeleteType('category'); }}><Delete fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                    {cat.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{cat.description}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Category Dialog */}
      <Dialog open={catDialog} onClose={() => setCatDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editCat ? 'Edit Category' : 'New Category'}</DialogTitle>
        <form onSubmit={catForm.handleSubmit(onCatSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Category Name" {...catForm.register('name', { required: true })} />
            <TextField fullWidth label="Description" multiline rows={2} {...catForm.register('description')} />
            <TextField fullWidth label="Icon (emoji)" {...catForm.register('icon')} placeholder="🍽️" />
            <Controller name="active" control={catForm.control} defaultValue={true} render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Active" />} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCatDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editCat ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit Menu Item' : 'New Menu Item'}</DialogTitle>
        <form onSubmit={itemForm.handleSubmit(onItemSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Item Name" {...itemForm.register('name', { required: true })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Controller name="categoryId" control={itemForm.control} rules={{ required: true }} defaultValue=""
                    render={({ field }) => (
                      <Select {...field} label="Category">
                        {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                      </Select>
                    )} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Controller name="type" control={itemForm.control} defaultValue="food"
                    render={({ field }) => (
                      <Select {...field} label="Type">
                        <MenuItem value="food">Food</MenuItem>
                        <MenuItem value="drink">Drink</MenuItem>
                      </Select>
                    )} />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Price ($)" type="number" inputProps={{ step: '0.01' }} {...itemForm.register('price', { required: true })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Prep Time (min)" type="number" {...itemForm.register('preparationTime')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Description" multiline rows={2} {...itemForm.register('description')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller name="available" control={itemForm.control} defaultValue={true} render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Available" />} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setItemDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editItem ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} title={`Delete ${deleteType === 'category' ? 'Category' : 'Menu Item'}`} message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
