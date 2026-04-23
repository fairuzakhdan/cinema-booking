'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiFilm, FiBookmark, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/elements';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/movies', label: 'Film', icon: <FiFilm size={16} /> },
    { href: '/bookings', label: 'Tiket Saya', icon: <FiBookmark size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/movies" className="flex items-center gap-2 font-bold text-lg text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <FiFilm size={16} className="text-white" />
            </div>
            <span>CineBook</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card)]',
                ].join(' ')}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                  <FiUser size={14} className="text-[var(--color-primary)]" />
                </div>
                <span className="text-[var(--color-text)] font-medium">{user.name}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
              <FiLogOut size={15} />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex gap-1 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
              ].join(' ')}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
