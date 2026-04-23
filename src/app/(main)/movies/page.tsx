'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiFilm } from 'react-icons/fi';
import { SearchBar, GenreFilter } from '@/components/fragments';
import { MovieGrid } from '@/components/layouts';
import { Spinner } from '@/components/elements';
import type { Movie } from '@/lib/types';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Semua');

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (genre !== 'Semua') params.set('genre', genre);
      if (search) params.set('q', search);
      const res = await fetch(`/api/movies?${params.toString()}`);
      const data = await res.json() as { movies: Movie[] };
      setMovies(data.movies ?? []);
    } finally {
      setLoading(false);
    }
  }, [genre, search]);

  useEffect(() => {
    const timer = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timer);
  }, [fetchMovies]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center">
          <FiFilm size={20} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)]">Film Sedang Tayang</h1>
          <p className="text-sm text-[var(--color-muted)]">{movies.length} film tersedia</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <GenreFilter selected={genre} onChange={setGenre} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
