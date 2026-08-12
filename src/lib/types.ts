export type UserRole = "learner" | "mentor_applicant" | "mentor" | "admin" | "support";

export type BookingStatus =
  | "slot_held"
  | "awaiting_payment"
  | "confirmed"
  | "rescheduled"
  | "canceled"
  | "completed"
  | "no_show"
  | "refund_pending"
  | "refunded"
  | "disputed";

export interface MentorCard {
  id: string;
  slug: string;
  name: string;
  headline: string;
  country: string;
  languages: string[];
  skills: string[];
  rating: number;
  sessions: number;
  priceFrom: number;
  currency: string;
  nextAvailable: string;
  verified?: boolean;
}
