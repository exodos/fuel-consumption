import NextAuth, { NextAuthOptions } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { User } from "@prisma/client";
import { verifyPassword } from "../../../lib/auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "My-Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const user: User = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (isValid) {
          return user;
        } else {
          console.log("Hash Not Matched To Logging In");
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    jwt: async ({ token, user }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token, user }) => {
      return { ...session, user: token };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
