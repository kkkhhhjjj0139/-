import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/api/tags",
  "/api/health",
  "/tag-loader.js",
  "/favicon.ico",
  "/_next"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  const expected = `Basic ${btoa(`${username}:${password}`)}`;

  if (header === expected) {
    return NextResponse.next();
  }

  return new NextResponse("관리자 인증이 필요합니다.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Conversion Script Manager"',
      "Cache-Control": "no-store"
    }
  });
}

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/api/:path*", "/tag-loader.js"]
};
