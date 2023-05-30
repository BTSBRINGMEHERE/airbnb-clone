import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing" | "totalPrice"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
  totalPrice: number;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerifed"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerifed: string | null;
};
