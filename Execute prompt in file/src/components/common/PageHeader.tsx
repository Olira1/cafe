import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: Props) {
  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      {breadcrumbs && (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1, overflow: 'hidden', '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}>
          {breadcrumbs.map((b, i) =>
            i < breadcrumbs.length - 1 ? (
              <Link key={i} href={b.href || '#'} underline="hover" color="text.secondary" variant="caption" sx={{ fontWeight: 600 }}>{b.label}</Link>
            ) : (
              <Typography key={i} variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>{b.label}</Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-end' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' }, lineHeight: 1.2 }}>{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' }, '& > .MuiButton-root': { flex: { xs: 1, sm: 'initial' } } }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}
