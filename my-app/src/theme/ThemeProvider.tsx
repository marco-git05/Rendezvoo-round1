import { createContext, useContext, useState, type ReactNode } from 'react';

import { PALETTES, type AppColors, type Palette, type ThemeName } from './palettes';

interface ThemeContextValue {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  palette: Palette;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('cactus');
  const palette = PALETTES[themeName];

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, palette, colors: palette.colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used inside <AppThemeProvider>');
  return ctx;
}