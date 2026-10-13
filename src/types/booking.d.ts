type BookingStatus = "pending" | "confirmed" | "cancelled";

type Booking = {
  booking_id: string;
  property_id: string;
  user_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: BookingStatus;
  created_at: string;
};

type CreateBookingInput = {
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: BookingStatus;
};

type ApiError = {
  errors?: [string, string][];
};