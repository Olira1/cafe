import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('rms_theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('rms_theme', next);
      return next;
    });
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: '#FF6B35', light: '#FF8C5A', dark: '#CC4F1A' },
        secondary: { main: '#2C3E50', light: '#3D5166', dark: '#1A2634' },
        background: {
          default: mode === 'light' ? '#F5F7FA' : '#0F1419',
          paper: mode === 'light' ? '#FFFFFF' : '#1A2332',
        },
        success: { main: '#27AE60' },
        warning: { main: '#F39C12' },
        error: { main: '#E74C3C' },
        info: { main: '#2980B9' },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
      },
      shape: { borderRadius: 12 },
      components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: mode === 'light' ? '0 2px 12px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0.3)' } } },
        MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
        MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
        MuiTableHead: { styleOverrides: { root: { '& .MuiTableCell-root': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } } } },
      },
    }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
