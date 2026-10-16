import type { Database } from "./database.types.js";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

type NewBooking = Omit<BookingInsert, "booking_id" | "created_at">

type BookingDates = Pick<Booking, 'check_in' | 'check_out'>