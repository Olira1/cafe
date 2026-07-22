import { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, IconButton, Avatar, Badge, Menu, MenuItem,
  Tooltip, Divider, useTheme, useMediaQuery, Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon, ChevronLeft, Notifications, DarkMode, LightMode,
  Logout, AccountCircle, Circle,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { getInitials, formatTime } from '../utils/formatters';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface Props {
  navItems: NavItem[];
  children: React.ReactNode;
  roleLabel: string;
  roleColor: string;
}

export default function DashboardLayout({ navItems, children, roleLabel, roleColor }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" fontWeight={800} color="white" fontSize={10}>RMS</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={800} noWrap>Grand Bistro</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ bgcolor: `${roleColor}20`, color: roleColor, px: 0.8, py: 0.1, borderRadius: 1, fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase' }}>
            {roleLabel}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setDrawerOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? `${roleColor}18` : 'transparent',
                  color: active ? roleColor : 'text.primary',
                  '&:hover': { bgcolor: `${roleColor}10` },
                  px: 1.5, py: 0.75,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? roleColor : 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: active ? 700 : 500 }} />
                {active && <Circle sx={{ fontSize: 6, color: roleColor }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: roleColor, width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700 }}>{getInitials(user?.name || 'U')}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', color: 'text.primary' }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)} size="small"><MenuIcon /></IconButton>
          <Box sx={{ flex: 1 }} />
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton onClick={toggleTheme} size="small">{mode === 'light' ? <DarkMode /> : <LightMode />}</IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}>
              <Badge badgeContent={unreadCount} color="error"><Notifications /></Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: roleColor, fontSize: '0.7rem', fontWeight: 700 }}>{getInitials(user?.name || 'U')}</Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu anchorEl={notifAnchor} open={!!notifAnchor} onClose={() => setNotifAnchor(null)} PaperProps={{ sx: { width: 360, maxHeight: 480 } }}>
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight={700}>Notifications</Typography>
          {unreadCount > 0 && <Typography variant="caption" sx={{ cursor: 'pointer', color: 'primary.main' }} onClick={markAllRead}>Mark all read</Typography>}
        </Box>
        <Divider />
        {notifications.slice(0, 8).map((n) => (
          <MenuItem key={n.id} onClick={() => markRead(n.id)} sx={{ whiteSpace: 'normal', py: 1.5, bgcolor: n.read ? 'transparent' : 'action.hover' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: n.read ? 'transparent' : 'error.main', mr: 1.5, flexShrink: 0 }} />
            <Box>
              <Typography variant="body2">{n.message}</Typography>
              <Typography variant="caption" color="text.secondary">{formatTime(n.timestamp)}</Typography>
            </Box>
          </MenuItem>
        ))}
        {notifications.length === 0 && <MenuItem disabled><Typography variant="body2" color="text.secondary">No notifications</Typography></MenuItem>}
      </Menu>

      {/* Profile Menu */}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight={700}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}><Logout fontSize="small" sx={{ mr: 1 }} />Logout</MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider', mt: '64px', height: 'calc(100% - 64px)', bgcolor: 'background.paper' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px', minWidth: 0, transition: 'margin 0.2s', bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Box>
    </Box>
  );
}
