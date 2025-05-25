import prisma from "@/lib/db";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";

import type { User, Session } from "@prisma/client";

/**
 * Generates a cryptographically secure random session token encoded in base32 (lowercase, no padding).
 * @returns A random session token string.
 */
export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

/**
 * Creates a new session in the database for a given user and token.
 * The session ID is a hex-encoded SHA-256 hash of the token for uniqueness and security.
 * @param token The session token string.
 * @param userId The user's unique identifier.
 * @returns The created Session object.
 */
export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
    };
    await prisma.session.create({
        data: session
    });
    return session;
}

/**
 * Validates a session token by checking if a corresponding session exists, is not expired,
 * and extends the session if it is close to expiring (within 15 days).
 * If the session is expired, it is deleted from the database.
 * @param token The session token string.
 * @returns An object containing the session and user if valid, or nulls if invalid/expired.
 */
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await prisma.session.findUnique({
        where: {
            id: sessionId
        },
        include: {
            user: true
        }
    });
    if (result === null) {
        // No session found for this token
        return { session: null, user: null };
    }
    const { user, ...session } = result;
    // If the session is expired, delete it and return nulls
    if (Date.now() >= session.expiresAt.getTime()) {
        await prisma.session.delete({ where: { id: sessionId } });
        return { session: null, user: null };
    }
    // If the session is within 15 days of expiring, extend its expiration
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                expiresAt: session.expiresAt
            }
        });
    }
    return { session, user };
}

/**
 * Retrieves the current session from the cookie store.
 * If a session cookie is present, validates it and returns the session and user.
 * If no session cookie is present, returns nulls.
 * The result is cached to prevent repeated validation.
 */
export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
    // Retrieve the session cookie from the request
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
        // No session cookie found, return nulls
        return { session: null, user: null };
    }
    // Validate the session token
    const result = await validateSessionToken(token);
    return result;
});

/**
 * Invalidates (deletes) a single session by its session ID.
 * @param sessionId The unique session ID to invalidate.
 */
export async function invalidateSession(sessionId: string): Promise<void> {
    await prisma.session.delete({ where: { id: sessionId } });
}

/**
 * Invalidates (deletes) all sessions for a given user.
 * @param userId The user's unique identifier.
 */
export async function invalidateAllSessions(userId: number): Promise<void> {
    await prisma.session.deleteMany({
        where: {
            userId
        }
    });
}

/**
 * The result type for session validation, containing either a valid session and user or nulls if invalid/expired.
 */
export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };