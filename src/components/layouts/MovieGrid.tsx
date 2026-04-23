'use client';

import { MovieCard } from '@/components/fragments';
import type { Movie } from '@/lib/types';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
}

export function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-muted)]">
        <p className="text-lg font-medium">Film tidak ditemukan</p>
        <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
