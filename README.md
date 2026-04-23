# CineBook — Cinema Ticket Booking System

Aplikasi pemesanan tiket bioskop berbasis web yang dibangun sebagai technical assessment untuk posisi Middle-Senior React/Next.js Developer.

---

## Cara Menjalankan Project

### Prasyarat
- Node.js 18+
- npm

### Instalasi & Menjalankan

```bash
git clone <repo-url>
cd cinema-booking
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm start
```

### Akun Demo

| Username | Password |
|----------|----------|
| rina     | rina123  |
| budi     | budi123  |
| sari     | sari123  |
| andi     | andi123  |
| mega     | mega123  |

---

## Arsitektur & Keputusan Teknis

### Struktur Folder — Atomic Design

```
src/components/
├── elements/     # Atoms  — Button, Input, Badge, Spinner
├── fragments/    # Molecules — MovieCard, SeatButton, CountdownTimer, PriceBreakdown, dll
├── layouts/      # Organisms — Navbar, SeatGrid, MovieGrid, BookingConfirmPanel
└── providers/    # StoreProvider (Redux Provider + auth hydration)
```

### State Management — Redux Toolkit

Dua slice terpisah dengan tanggung jawab yang jelas:

- **`auth.slice.ts`** — Sesi user dihidrasi dari `GET /api/auth/me` saat mount. Actions: `setUser`, `clearUser`, `setLoading`.
- **`booking.slice.ts`** — State alur pemesanan (kursi terpilih, timer, price breakdown). Ephemeral — direset setelah booking selesai atau timer habis. Actions: `setShowtime`, `toggleSeat`, `startTimer`, `decrementTimer`, `stopTimer`, `resetBooking`, `setPriceBreakdown`, `setConfirmedBookingId`.

Store dikonfigurasi di `src/stores/store.ts` menggunakan `configureStore`. Typed hooks `useAppDispatch` dan `useAppSelector` digunakan di seluruh komponen untuk type safety penuh.

### Autentikasi — Cookie-Based Session

1. Login → `POST /api/auth/login` → server buat `sessionId` (UUID) di in-memory store
2. Cookie `sessionId` di-set sebagai `HttpOnly; SameSite=Strict`
3. Route protection via `src/proxy.ts` (Next.js middleware) — redirect ke `/login` jika tidak ada cookie

### In-Memory Server Store (`src/lib/server/data-store.ts`)

Module-level singleton yang diinisialisasi dari JSON files:
- `seatState` — Map `showtimeId → seatId → status`, diupdate saat booking/cancel
- `sessions` — Map `sessionId → { userId, expiresAt }`
- `bookings` — Map `bookingId → Booking`

**Trade-off:** Data hilang saat server restart. Untuk production multi-instance, perlu Redis atau database.

### Pricing Engine — Server-Side Only

| Faktor | Aturan |
|--------|--------|
| Zona kursi | A-B: +30%, C-F: normal, G-H: -20% |
| Hari | Sabtu/Minggu: +20% |
| Waktu | 17:00–21:00: +15% |
| Grup | 4+ kursi: diskon 10% dari total |

Endpoint `POST /api/bookings/preview` untuk price breakdown real-time tanpa membuat booking.

### Gap Rule

Validasi di dua tempat:
- **Client-side** — preview real-time, feedback langsung ke user
- **Server-side** (`POST /api/bookings`) — validasi final yang tidak bisa di-bypass

### Countdown Timer

- Dimulai saat masuk halaman pemilihan kursi (5 menit)
- Di bawah 60 detik: timer merah + animasi pulse
- Saat habis: booking direset, redirect ke halaman film

### Dynamic Styling

CSS custom properties di `globals.css`, diekspos ke Tailwind via `@theme inline`. Tidak ada hardcoded hex di komponen.

---

## Color Palette

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `--color-bg` | `#0A0A0F` | Background utama |
| `--color-surface` | `#141420` | Navbar, surface sekunder |
| `--color-card` | `#1E1E2E` | Card, panel, input |
| `--color-primary` | `#E63946` | CTA, aksen utama, kursi terpilih |
| `--color-accent` | `#F4A261` | Harga, highlight sekunder |
| `--color-text` | `#F1F5F9` | Teks utama |
| `--color-muted` | `#64748B` | Teks sekunder, placeholder |
| `--color-border` | `#2D2D3F` | Border, divider |
| `--color-success` | `#22C55E` | Status aktif |
| `--color-warning` | `#EAB308` | Markup harga |

---

## Icon Library

**React Icons** (`react-icons`) — set **Feather Icons** (`react-icons/fi`) untuk konsistensi visual.

---

## Yang Akan Ditingkatkan Jika Ada Waktu Lebih

1. **Persistent storage** — SQLite via Prisma atau PostgreSQL
2. **Unit tests** — Pricing engine dan gap rule (pure functions, mudah di-test)
3. **Seat lock mechanism** — Mencegah race condition di multi-user scenario
4. **Optimistic UI** — Update seat state sebelum response server
5. **Animasi** — Transisi halaman, konfetti saat booking berhasil
6. **Gambar poster** — Integrasi TMDB API

---

## Live Demo

> Akan ditambahkan setelah deploy ke Vercel
