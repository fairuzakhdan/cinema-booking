'use client';

import { FiSearch } from 'react-icons/fi';
import { Input } from '@/components/elements';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Cari film...' }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leftIcon={<FiSearch size={16} />}
    />
  );
}
