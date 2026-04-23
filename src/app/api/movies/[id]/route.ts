import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/server/data-store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getStore();
  const movie = store.movies.find((m) => m.id === id);

  if (!movie) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }

  return NextResponse.json({ movie }, { status: 200 });
}
