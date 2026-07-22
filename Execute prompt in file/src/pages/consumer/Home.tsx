import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import { Restaurant, Star, LocalShipping, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { settingsService } from '../../services/settingsService';

export default function ConsumerHome() {
  const navigate = useNavigate();
  const settings = settingsService.get();

  const features = [
    { icon: <Restaurant sx={{ fontSize: 36, color: '#FF6B35' }} />, title: 'Fresh Daily Menu', desc: 'Quality ingredients prepared fresh every day' },
    { icon: <Star sx={{ fontSize: 36, color: '#F39C12' }} />, title: 'Chef\'s Specials', desc: 'Seasonal dishes crafted by our expert chefs' },
    { icon: <Phone sx={{ fontSize: 36, color: '#27AE60' }} />, title: 'Easy Ordering', desc: 'Order online or scan QR code at your table' },
  ];

  return (
    <Box>
      {/* Navbar */}
      <Box sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Restaurant color="primary" />
          <Typography fontWeight={800} variant="h6" color="primary">{settings.restaurantName}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={() => navigate('/consumer/menu')}>Menu</Button>
          <Button onClick={() => navigate('/qr')}>QR Menu</Button>
          <Button variant="contained" onClick={() => navigate('/login')}>Staff Login</Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #2C3E50 100%)', color: 'white', py: 12, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={900} gutterBottom>{settings.restaurantName}</Typography>
          <Typography variant="h5" sx={{ opacity: 0.85, mb: 4 }}>Fine dining experience — crafted with passion</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: '#FF6B35', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }} onClick={() => navigate('/consumer/menu')}>
              View Menu
            </Button>
            <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white', fontWeight: 700 }} onClick={() => navigate('/qr')}>
              QR Menu
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{f.title}</Typography>
                  <Typography color="text.secondary">{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>{settings.restaurantName} · {settings.address} · {settings.phone}</Typography>
      </Box>
    </Box>
  );
}
