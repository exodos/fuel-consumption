import NextAuth from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      mobileNumber: string;
      adminResetPassword: boolean;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}
