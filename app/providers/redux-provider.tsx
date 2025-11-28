'use client';

import { store, AppDispatch } from '@/lib/redux/store';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRealTimeLatency, initializeData } from '@/lib/redux/slice/latencySlice';

const DataLoader = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(initializeData()).unwrap();
        await dispatch(fetchRealTimeLatency()).unwrap();
      } catch (error) {
        console.warn('Data loading failed, using fallback data:', error);
      }
    };

    loadData();

    const interval = setInterval(() => {
      dispatch(fetchRealTimeLatency());
    }, 10000); 

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <DataLoader />
      {children}
    </Provider>
  );
}