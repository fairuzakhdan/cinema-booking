'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, setUser, clearUser, setLoading } from '@/stores';
import type { User } from '@/lib/types';

function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json() as Promise<{ user: User }>;
      })
      .then(({ user }) => dispatch(setUser(user)))
      .catch(() => dispatch(clearUser()));
  }, [dispatch]);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
