import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';

export async function GET(req: NextRequest) {
  const store = getStore();
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre');
  const q = searchParams.get('q');

  let movies = store.movies;

  if (genre) {
    movies = movies.filter((m) => m.genre.toLowerCase() === genre.toLowerCase());
  }
  if (q) {
    movies = movies.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));
  }

  return NextResponse.json({ movies }, { status: 200 });
}
