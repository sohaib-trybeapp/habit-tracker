import { format } from "date-fns";

export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDisplayDate(date: Date): string {
  return format(date, "EEE, MMM d");
}
