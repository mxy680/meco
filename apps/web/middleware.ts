import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/sessions";
import type { NextRequest } from "next/server";

/**
 * Middleware to enforce strict origin checks for non-GET requests.
 *
 * - For GET requests, extends the session cookie's expiration if present.
 * - For other methods, checks that the request's Origin header matches the Host header.
 * - Denies requests with missing or mismatched Origin/Host headers, returning 403 Forbidden.
 * - Protects against CSRF and cross-origin attacks by ensuring requests originate from the same host.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
    // Protect all routes except those starting with /auth
    const { pathname } = request.nextUrl;
    // Only skip session validation for /auth routes (e.g., /auth/login, /auth/register)
    if (!pathname.startsWith("/auth")) {
        const { session } = await getCurrentSession();
        if (!session) {
            // Redirect unauthenticated users to /login
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
    // Handle all GET requests (including protected, since session is now checked)
    if (request.method === "GET") {
        const response = NextResponse.next();
        const token = request.cookies.get("session")?.value ?? null;
        if (token !== null) {
            /**
             * If a session cookie is present on a GET request, extend its expiration.
             *
             * - This implements sliding session expiration: each user activity (GET) keeps the session alive.
             * - We only do this on GET requests because POST/PUT/etc. may result in a new session being set,
             *   and we don't want to overwrite a newly issued token.
             * - This helps keep users logged in as long as they're active, but doesn't prolong inactive sessions.
             */
            response.cookies.set("session", token, {
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30 days
                sameSite: "lax",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            });
        }
        return response;
    }
    // Retrieve the Origin and Host headers from the request
    const originHeader = request.headers.get("Origin");
    // NOTE: In some deployments, you may need to use `X-Forwarded-Host` instead of Host
    const hostHeader = request.headers.get("Host");
    // If either Origin or Host is missing, reject the request
    if (originHeader === null || hostHeader === null) {
        return new NextResponse(null, {
            status: 403
        });
    }
    let origin: URL;
    // Attempt to parse the Origin header as a URL
    try {
        origin = new URL(originHeader);
    } catch {
        // If Origin is not a valid URL, reject the request
        return new NextResponse(null, {
            status: 403
        });
    }
    // If the host in the Origin header does not match the Host header, reject the request
    if (origin.host !== hostHeader) {
        return new NextResponse(null, {
            status: 403
        });
    }
    // All checks passed; allow the request to proceed
    return NextResponse.next();
}