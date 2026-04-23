import Link from 'next/link';
import { FiClock, FiStar } from 'react-icons/fi';
import { Badge } from '@/components/elements';
import type { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
}

const ratingVariant: Record<string, 'default' | 'warning' | 'danger' | 'success'> = {
  G: 'success',
  PG: 'default',
  'PG-13': 'warning',
  R: 'danger',
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-200 hover:border-[var(--color-primary)]/50 hover:shadow-lg hover:shadow-[var(--color-primary)]/10 hover:-translate-y-0.5">
        {/* Poster placeholder */}
        <div className="relative h-56 bg-[var(--color-surface)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10" />
          <div className="text-center z-10 px-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-2">
              <FiStar size={28} className="text-[var(--color-primary)]" />
            </div>
            <p className="text-xs text-[var(--color-muted)] line-clamp-2">{movie.title}</p>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[var(--color-text)] text-sm leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
              {movie.title}
            </h3>
            <Badge variant={ratingVariant[movie.rating] ?? 'default'}>{movie.rating}</Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
            <span className="flex items-center gap-1">
              <FiClock size={12} />
              {movie.duration} mnt
            </span>
            <Badge variant="default">{movie.genre}</Badge>
          </div>

          <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>

          <div className="pt-1">
            <span className="text-xs text-[var(--color-accent)] font-medium">
              {movie.showtimes.length} jadwal tersedia
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
