import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = '#FF6B35', trend, subtitle }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {trend >= 0 ? <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} /> : <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />}
                <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'} fontWeight={700}>
                  {Math.abs(trend)}% vs last period
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}20`, width: 56, height: 56 }}>
            <Box sx={{ color }}>{icon}</Box>
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
