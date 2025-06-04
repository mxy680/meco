import { auth } from "@/lib/auth"

const PUBLIC_FILE = /\.(.*)$/;

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow requests for Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Redirect authenticated users away from /auth/signin
  if (pathname.startsWith("/auth/signin") && req.auth) {
    const newUrl = new URL("/chat", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Allow unauthenticated users to access /auth/signin
  if (pathname.startsWith("/auth/signin")) {
    return;
  }

  // Redirect unauthenticated users to /auth/signin
  if (!req.auth) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});