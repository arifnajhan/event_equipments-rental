'use client';

import { useEffect, useState } from 'react';
import ThemeContext from '@/context/themeContext';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with false to match server-side render
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only access localStorage after component mounts on client
    const themeFromStorage = localStorage.getItem('hotel-theme');
    setDarkTheme(themeFromStorage ? JSON.parse(themeFromStorage) : false);
    setMounted(true);
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('hotel-theme', JSON.stringify(darkTheme));
    }
  }, [darkTheme, mounted]);

  // Prevent hydration mismatch by rendering with initial state
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="text-[#1E1E1E]">{children}</div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <div className={`${darkTheme ? 'dark' : ''} min-h-screen`}>
        <div className='dark:text-white dark:bg-black text-[#1E1E1E]'>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;