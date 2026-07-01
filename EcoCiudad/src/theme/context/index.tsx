import { createContext, useContext, useMemo } from 'react';
import { type Theme, citizenTheme, operatorTheme, adminTheme, type ThemeRole } from '../index';

const ThemeContext = createContext<Theme>(citizenTheme);

export interface ThemeProviderProps {
  children: React.ReactNode;
  role?: ThemeRole;
}

export function ThemeProvider({ children, role = 'citizen' }: ThemeProviderProps) {
  const theme = useMemo(() => {
    switch (role) {
      case 'operator':
        return operatorTheme;
      case 'admin':
        return adminTheme;
      default:
        return citizenTheme;
    }
  }, [role]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}

export function useThemeRole(): ThemeRole {
  const { role } = useTheme();
  return role;
}
