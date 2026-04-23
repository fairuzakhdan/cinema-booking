'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilm, FiLock, FiUser } from 'react-icons/fi';
import { Button } from '@/components/elements';
import { Input } from '@/components/elements';
import { useAppDispatch, setUser } from '@/stores';
import type { User } from '@/lib/types';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json() as { user?: User; error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Login gagal');
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
        router.replace('/movies');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <FiFilm size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">CineBook</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">Masuk untuk memesan tiket</p>
        </div>

        {/* Form */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              leftIcon={<FiUser size={16} />}
              autoComplete="username"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              leftIcon={<FiLock size={16} />}
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Masuk
            </Button>
          </form>

          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-muted)] text-center mb-2">Akun demo:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--color-muted)]">
              {[['rina', 'rina123'], ['budi', 'budi123'], ['sari', 'sari123'], ['andi', 'andi123']].map(([u, p]) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setUsername(u); setPassword(p); }}
                  className="text-left px-2 py-1.5 rounded bg-[var(--color-surface)] hover:bg-[var(--color-border)] transition-colors"
                >
                  <span className="text-[var(--color-accent)]">{u}</span> / {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
