import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

interface Props {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export default function EmptyState({ title = 'No data found', description = 'There are no records to display.', action, icon }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, px: 2 }}>
      <Box sx={{ color: 'text.disabled', mb: 2, '& svg': { fontSize: 64 } }}>
        {icon || <InboxOutlined />}
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center" maxWidth={300}>{description}</Typography>
      {action && <Button variant="contained" onClick={action.onClick} sx={{ mt: 2 }}>{action.label}</Button>}
    </Box>
  );
}
