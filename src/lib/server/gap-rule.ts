interface GapRuleResult {
  valid: boolean;
  violatingSeats: string[];
}

/**
 * Checks if selecting `newSeatIds` would leave exactly one empty seat
 * trapped between occupied seats in any row.
 * `occupiedSeatIds` = already booked seats for this showtime.
 * `allSeatIds` = all seat IDs in the studio (to know row boundaries).
 */
export function validateGapRule(
  newSeatIds: string[],
  occupiedSeatIds: string[],
  allSeatIds: string[]
): GapRuleResult {
  // Group all seats by row
  const rowMap: Record<string, number[]> = {};
  for (const seatId of allSeatIds) {
    const row = seatId.charAt(0).toUpperCase();
    const num = parseInt(seatId.slice(1), 10);
    if (!rowMap[row]) rowMap[row] = [];
    rowMap[row].push(num);
  }

  // Sort each row's seat numbers
  for (const row of Object.keys(rowMap)) {
    rowMap[row].sort((a, b) => a - b);
  }

  // Build set of occupied seats (booked + newly selected)
  const occupiedSet = new Set<string>([...occupiedSeatIds, ...newSeatIds]);

  const violatingSeats: string[] = [];

  for (const [row, numbers] of Object.entries(rowMap)) {
    for (let i = 1; i < numbers.length - 1; i++) {
      const prev = `${row}${numbers[i - 1]}`;
      const curr = `${row}${numbers[i]}`;
      const next = `${row}${numbers[i + 1]}`;

      // curr is empty, prev and next are occupied → gap violation
      if (!occupiedSet.has(curr) && occupiedSet.has(prev) && occupiedSet.has(next)) {
        violatingSeats.push(curr);
      }
    }
  }

  return { valid: violatingSeats.length === 0, violatingSeats };
}
