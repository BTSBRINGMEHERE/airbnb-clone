import { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerifed"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerifed: string | null;
};
