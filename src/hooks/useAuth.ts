'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, isAuthenticated, isLoading, clearUser } = useAuthStore();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    router.push('/login');
  };

  return { user, isAuthenticated, isLoading, logout };
}
