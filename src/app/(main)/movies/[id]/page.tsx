'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiClock, FiStar, FiCalendar } from 'react-icons/fi';
import { Badge, Button, Spinner } from '@/components/elements';
import { ShowtimeCard } from '@/components/fragments';
import { useAppDispatch, setShowtime } from '@/stores';
import type { Movie, Showtime } from '@/lib/types';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

const ratingVariant: Record<string, 'default' | 'warning' | 'danger' | 'success'> = {
  G: 'success', PG: 'default', 'PG-13': 'warning', R: 'danger',
};

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [movieId, setMovieId] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => {
      setMovieId(id);
      fetch(`/api/movies/${id}`)
        .then((r) => r.json() as Promise<{ movie: Movie }>)
        .then(({ movie }) => setMovie(movie))
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleSelectShowtime = (showtime: Showtime) => {
    if (!movie) return;
    dispatch(setShowtime({
      movieId: movie.id,
      movieTitle: movie.title,
      showtimeId: showtime.id,
      showtimeDate: showtime.date,
      showtimeTime: showtime.time,
      basePrice: showtime.basePrice,
    }));
    router.push(`/movies/${movie.id}/showtimes/${showtime.id}/seats`);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!movie) {
    return <div className="text-center py-20 text-[var(--color-muted)]">Film tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-1.5">
        <FiArrowLeft size={16} /> Kembali
      </Button>

      {/* Movie info */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[var(--color-text)]">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={ratingVariant[movie.rating] ?? 'default'}>{movie.rating}</Badge>
              <Badge variant="default">{movie.genre}</Badge>
              <span className="flex items-center gap-1 text-sm text-[var(--color-muted)]">
                <FiClock size={13} /> {movie.duration} menit
              </span>
            </div>
          </div>
          <div className="w-16 h-20 rounded-xl bg-[var(--color-surface)] flex items-center justify-center flex-shrink-0">
            <FiStar size={24} className="text-[var(--color-primary)]" />
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">{movie.synopsis}</p>
      </div>

      {/* Showtimes */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
          <FiCalendar size={16} className="text-[var(--color-accent)]" />
          Jadwal Tayang ({movie.showtimes.length})
        </h2>
        {movie.showtimes.map((showtime) => (
          <ShowtimeCard
            key={showtime.id}
            showtime={showtime}
            movieId={movieId}
            movieTitle={movie.title}
            onSelect={handleSelectShowtime}
          />
        ))}
      </div>
    </div>
  );
}
