import type { Program } from "../catalog/types";
export type BookingCalendar = {
  program: Program;
  categorySlug: string;
  instructorId: string;
  url: string;
};
/** Confirm the instructor and add their Google appointment-schedule URL here. */
export const bookingCalendars: BookingCalendar[] = [];
