import Link from 'next/link';
import { FiClock, FiZap, FiHeart, FiCpu, FiSmile, FiAlertTriangle } from 'react-icons/fi';
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

const genreStyle: Record<string, { gradient: string; iconColor: string; icon: React.ReactNode }> = {
  Action:  { gradient: 'from-red-900/60 to-orange-900/40',   iconColor: 'text-orange-400', icon: <FiZap size={32} /> },
  Drama:   { gradient: 'from-purple-900/60 to-pink-900/40',  iconColor: 'text-pink-400',   icon: <FiHeart size={32} /> },
  'Sci-Fi':{ gradient: 'from-cyan-900/60 to-blue-900/40',    iconColor: 'text-cyan-400',   icon: <FiCpu size={32} /> },
  Comedy:  { gradient: 'from-yellow-900/60 to-green-900/40', iconColor: 'text-yellow-400', icon: <FiSmile size={32} /> },
  Horror:  { gradient: 'from-gray-900/80 to-red-950/60',     iconColor: 'text-red-500',    icon: <FiAlertTriangle size={32} /> },
};

export function MovieCard({ movie }: MovieCardProps) {
  const style = genreStyle[movie.genre] ?? {
    gradient: 'from-slate-900/60 to-slate-800/40',
    iconColor: 'text-slate-400',
    icon: <FiZap size={32} />,
  };

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-200 hover:border-[var(--color-primary)]/50 hover:shadow-lg hover:shadow-[var(--color-primary)]/10 hover:-translate-y-0.5">
        {/* Poster */}
        <div className={`relative h-56 bg-[var(--color-surface)] flex items-center justify-center overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
          {/* subtle film grain texture via repeating pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          <div className="text-center z-10 px-4 space-y-3">
            <div className={`w-16 h-16 rounded-2xl bg-black/30 flex items-center justify-center mx-auto ${style.iconColor}`}>
              {style.icon}
            </div>
            <p className="text-sm font-semibold text-white/90 line-clamp-2 leading-snug drop-shadow">{movie.title}</p>
          </div>
          {/* genre label top-left */}
          <span className="absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
            {movie.genre}
          </span>
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
