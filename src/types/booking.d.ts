import type { Database } from "./database.types.js";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  status: BookingStatus;
};

export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

export type NewBooking = Omit<BookingInsert, "booking_id" | "created_at"> & {
  property_id?: string;
  user_id?: string;
  status?: BookingStatus;
};

export type BookingDates = Pick<Booking, "check_in" | "check_out">;
