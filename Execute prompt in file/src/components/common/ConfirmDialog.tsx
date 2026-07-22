import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

interface Props {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmColor?: 'error' | 'primary' | 'warning';
}

export default function ConfirmDialog({ open, title = 'Confirm Action', message, onConfirm, onCancel, confirmText = 'Confirm', confirmColor = 'error' }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmber color={confirmColor} />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color={confirmColor} onClick={onConfirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}
