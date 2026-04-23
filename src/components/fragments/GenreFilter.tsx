'use client';

import { Button } from '@/components/elements';

const GENRES = ['Semua', 'Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'];

interface GenreFilterProps {
  selected: string;
  onChange: (genre: string) => void;
}

export function GenreFilter({ selected, onChange }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => (
        <Button
          key={genre}
          variant={selected === genre ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onChange(genre)}
        >
          {genre}
        </Button>
      ))}
    </div>
  );
}
