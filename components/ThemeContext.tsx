import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// rerender-memo: stable default to avoid breaking memoization
const NOOP = () => { };

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: NOOP,
});

// client-localstorage-schema: versioned key
const STORAGE_KEY = 'deis-theme:v1';

// Always start in light mode; only respect stored user choice
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // client-localstorage-schema: incognito/disabled
  }
  return 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // client-localstorage-schema: quota exceeded / disabled
    }
  }, [theme]);

  // rerender-functional-setstate: stable callback, no deps
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // rerender-memo: memoize context value to avoid re-rendering all consumers
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
