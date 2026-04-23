'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/lib/types';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json() as Promise<{ user: User }>;
      })
      .then(({ user }) => setUser(user))
      .catch(() => clearUser());
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}
