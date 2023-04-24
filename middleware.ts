import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const ROLES_ALLOWED_TO_AUTH = new Set<Role>([
  Role.SUPERADMIN,
  Role.ADMIN,
  Role.USER,
]);

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/consumption") &&
      req.nextauth.token?.role !== Role.SUPERADMIN
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) =>
        token?.role !== undefined && ROLES_ALLOWED_TO_AUTH.has(token.role),
    },
  }
);
export const config = {
  matcher: ["/consumption/:path*"],
};
