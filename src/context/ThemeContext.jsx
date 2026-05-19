/**
 * Theme Context
 * 
 * Provides theme management (dark/light mode) for the application.
 * Persists theme preference in localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/appConfig';
import { getItem, setItem } from '../utils/storage';

const ThemeContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return getItem('theme') || 'light';
  });
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolvedTheme) => {
      setResolvedTheme(resolvedTheme);
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const value = {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
