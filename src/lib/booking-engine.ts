export type TimeRange = { start: Date; end: Date };

export function overlaps(a: TimeRange, b: TimeRange) {
  return a.start < b.end && b.start < a.end;
}

export function assertValidRange(range: TimeRange) {
  if (!(range.start instanceof Date) || !(range.end instanceof Date) || Number.isNaN(range.start.valueOf()) || Number.isNaN(range.end.valueOf())) {
    throw new Error("Invalid booking time range");
  }
  if (range.end <= range.start) throw new Error("Booking must end after it starts");
}

export function isSlotAvailable(slot: TimeRange, busy: TimeRange[], bufferBeforeMinutes = 0, bufferAfterMinutes = 0) {
  assertValidRange(slot);
  const padded = {
    start: new Date(slot.start.getTime() - bufferBeforeMinutes * 60_000),
    end: new Date(slot.end.getTime() + bufferAfterMinutes * 60_000),
  };
  return busy.every((event) => !overlaps(padded, event));
}

export function calculateCommission(grossMinor: number, commissionBps: number) {
  if (!Number.isInteger(grossMinor) || grossMinor < 0) throw new Error("Invalid amount");
  const platformMinor = Math.round((grossMinor * commissionBps) / 10_000);
  return { grossMinor, platformMinor, mentorMinor: grossMinor - platformMinor };
}
