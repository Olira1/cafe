import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, InputAdornment, IconButton, Divider, Chip } from '@mui/material';
import { Visibility, VisibilityOff, Restaurant } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface FormData { email: string; password: string; }

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@restaurant.com', password: '123456', color: '#FF6B35' },
  { label: 'Cashier', email: 'cashier@restaurant.com', password: '123456', color: '#2980B9' },
  { label: 'Chef', email: 'chef@restaurant.com', password: '123456', color: '#27AE60' },
  { label: 'Waiter', email: 'waiter@restaurant.com', password: '123456', color: '#8E44AD' },
];

const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin',
  cashier: '/cashier',
  chef: '/chef',
  waiter: '/waiter',
  consumer: '/consumer',
};

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const user = login(data.email, data.password);
    if (!user) { setError('Invalid credentials or account inactive'); return; }
    navigate(ROLE_ROUTES[user.role] || '/admin');
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setError('');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #FF6B35 0%, #2C3E50 100%)' }}>
      {/* Left brand panel */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 6, color: 'white' }}>
        <Restaurant sx={{ fontSize: 72, mb: 3, opacity: 0.9 }} />
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>The Grand Bistro</Typography>
        <Typography variant="h6" textAlign="center" sx={{ opacity: 0.8, maxWidth: 360 }}>Restaurant Management System — Enterprise Edition</Typography>
        <Box sx={{ mt: 6, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['POS System', 'Kitchen Display', 'Inventory', 'Analytics'].map((f) => (
            <Box key={f} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>{f}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right login panel */}
      <Box sx={{ width: { xs: '100%', md: 480 }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Restaurant sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight={800}>Sign In</Typography>
            <Typography variant="body2" color="text.secondary">Access your restaurant dashboard</Typography>
          </Box>

          <Card>
            <CardContent sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth label="Email Address" type="email" sx={{ mb: 2 }}
                  {...register('email', { required: 'Email is required' })}
                  error={!!errors.email} helperText={errors.email?.message}
                />
                <TextField
                  fullWidth label="Password" type={showPw ? 'text' : 'password'} sx={{ mb: 3 }}
                  {...register('password', { required: 'Password is required' })}
                  error={!!errors.password} helperText={errors.password?.message}
                  InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(!showPw)} edge="end">{showPw ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
                />
                <Button type="submit" fullWidth variant="contained" size="large" disabled={isSubmitting} sx={{ py: 1.5, fontWeight: 700 }}>
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }}><Typography variant="caption" color="text.secondary">Quick Access Demo</Typography></Divider>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {DEMO_USERS.map((u) => (
                <Chip key={u.label} label={u.label} onClick={() => fillDemo(u.email, u.password)}
                  sx={{ bgcolor: `${u.color}20`, color: u.color, fontWeight: 700, cursor: 'pointer', '&:hover': { bgcolor: `${u.color}30` } }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 1 }}>
              Click a role to pre-fill credentials
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
