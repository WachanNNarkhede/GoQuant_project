'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useEffect } from 'react';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Apply theme to document for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeWrapper;