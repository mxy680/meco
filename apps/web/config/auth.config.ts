import GitHub from "next-auth/providers/github"
import Bitbucket from "next-auth/providers/bitbucket"
import type { NextAuthConfig } from "next-auth"

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [GitHub, Bitbucket],
} satisfies NextAuthConfig