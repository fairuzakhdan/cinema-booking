import type { PriceBreakdown } from '@/lib/types';

function getSeatZoneMultiplier(row: string): number {
  if (['A', 'B'].includes(row)) return 1.3;
  if (['G', 'H'].includes(row)) return 0.8;
  return 1.0;
}

function isDayMarkupApplicable(dateStr: string): boolean {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0=Sun, 6=Sat
  return day === 0 || day === 6;
}

function isTimeMarkupApplicable(timeStr: string): boolean {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + (minutes ?? 0);
  return totalMinutes >= 17 * 60 && totalMinutes <= 21 * 60;
}

export function calculatePrice(
  seatIds: string[],
  date: string,
  time: string,
  basePrice: number
): PriceBreakdown {
  const applyDay = isDayMarkupApplicable(date);
  const applyTime = isTimeMarkupApplicable(time);
  const applyGroup = seatIds.length >= 4;

  const totalPerSeat: number[] = [];

  for (const seatId of seatIds) {
    const row = seatId.charAt(0).toUpperCase();
    const zoneMultiplier = getSeatZoneMultiplier(row);
    let price = basePrice * zoneMultiplier;
    if (applyDay) price *= 1.2;
    if (applyTime) price *= 1.15;
    totalPerSeat.push(Math.round(price));
  }

  let subtotal = totalPerSeat.reduce((a, b) => a + b, 0);
  const groupDiscount = applyGroup ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - groupDiscount;

  const firstRow = seatIds[0]?.charAt(0).toUpperCase() ?? 'C';
  const zoneMultiplier = getSeatZoneMultiplier(firstRow);
  const zoneAdjustment = zoneMultiplier !== 1.0 ? Math.round(basePrice * (zoneMultiplier - 1.0)) : 0;
  const dayMarkup = applyDay ? Math.round(basePrice * 0.2) : 0;
  const timeMarkup = applyTime ? Math.round(basePrice * 0.15) : 0;

  return {
    basePrice,
    zoneAdjustment,
    dayMarkup,
    timeMarkup,
    groupDiscount,
    totalPerSeat,
    total,
    seatCount: seatIds.length,
  };
}
