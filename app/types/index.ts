import { Listing, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerifed"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerifed: string | null;
};
