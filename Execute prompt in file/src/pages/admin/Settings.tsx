import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Divider, Alert, MenuItem, Select, FormControl, InputLabel, Snackbar } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import { settingsService } from '../../services/settingsService';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
];

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset, control, formState: { isDirty } } = useForm();

  useEffect(() => {
    const s = settingsService.get();
    reset(s);
  }, []);

  const onSubmit = (data: any) => {
    settingsService.update(data);
    setSaved(true);
    reset(data);
  };

  return (
    <AdminLayout>
      <PageHeader title="Restaurant Settings" subtitle="Configure your restaurant profile and preferences" breadcrumbs={[{ label: 'Admin' }, { label: 'Settings' }]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* General Info */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>General Information</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Restaurant Name" {...register('restaurantName')} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Phone" {...register('phone')} /></Grid>
                  <Grid size={{ xs: 6 }}><TextField fullWidth label="Email" type="email" {...register('email')} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Address" multiline rows={2} {...register('address')} /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Financial Settings */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Financial</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField fullWidth label="Tax Rate (%)" type="number" inputProps={{ step: '0.1' }} {...register('tax')} />
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Controller name="currency" control={control} defaultValue="USD" render={({ field }) => (
                      <Select {...field} label="Currency" onChange={(e) => {
                        field.onChange(e.target.value);
                        const cur = CURRENCIES.find((c) => c.code === e.target.value);
                      }}>
                        {CURRENCIES.map((c) => <MenuItem key={c.code} value={c.code}>{c.name} ({c.symbol})</MenuItem>)}
                      </Select>
                    )} />
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Opening Hours */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Opening Hours</Typography>
                <Grid container spacing={2}>
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                    <Grid key={day} size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField fullWidth label={day.charAt(0).toUpperCase() + day.slice(1)} placeholder="09:00-22:00" {...register(`openingHours.${day}`)} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => reset(settingsService.get())}>Reset</Button>
              <Button type="submit" variant="contained" disabled={!isDirty}>Save Changes</Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} message="Settings saved successfully" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </AdminLayout>
  );
}
