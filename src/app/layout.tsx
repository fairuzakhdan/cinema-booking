import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreProvider';

export const metadata: Metadata = {
  title: 'CineBook — Cinema Ticket Booking',
  description: 'Pesan tiket bioskop favoritmu dengan mudah',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
