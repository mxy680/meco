import { cookies } from "next/headers";

/**
 * Sets a secure, HTTP-only session cookie for the user.
 *
 * - The cookie is named "session" and stores the session token.
 * - The cookie is marked httpOnly to prevent JavaScript access (mitigates XSS).
 * - sameSite: "lax" helps protect against CSRF attacks while allowing normal navigation.
 * - secure: true in production ensures the cookie is only sent over HTTPS.
 * - expires: sets the cookie's expiration date to the session's expiration.
 * - path: "/" makes the cookie available to the entire site.
 *
 * @param token The session token to set in the cookie.
 * @param expiresAt The expiration date of the session and cookie.
 */
export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/"
    });
}

/**
 * Deletes the session cookie by setting its value to an empty string and maxAge to 0.
 *
 * - This removes the session token from the user's browser.
 * - The cookie options match those used in setSessionTokenCookie for consistency.
 */
export async function deleteSessionTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/"
    });
}