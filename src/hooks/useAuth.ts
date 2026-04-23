'use client';

import { useAppDispatch, useAppSelector, clearUser } from '@/stores';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    dispatch(clearUser());
    router.push('/login');
  };

  return { user, isAuthenticated, isLoading, logout };
}
