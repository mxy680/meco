import GitHub from "next-auth/providers/github"
import Bitbucket from "next-auth/providers/bitbucket"
import GitLab from "next-auth/providers/gitlab"
import HuggingFace from "next-auth/providers/huggingface"
import type { NextAuthConfig } from "next-auth"

type BitbucketEmail = {
    is_primary: boolean;
    is_confirmed: boolean;
    email: string;
};

export default {
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }), Bitbucket({
            clientId: process.env.AUTH_BITBUCKET_ID,
            clientSecret: process.env.AUTH_BITBUCKET_SECRET,
            authorization: { params: { scope: "account email" } }, // request email scope
            async profile(profile, tokens) {
                // Fetch the user's emails from Bitbucket API
                const res = await fetch("https://api.bitbucket.org/2.0/user/emails", {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    },
                });
                const data = await res.json();

                // Find the primary, confirmed email
                const primary = data.values?.find((e: BitbucketEmail) => e.is_primary && e.is_confirmed);
                return {
                    id: profile.uuid,
                    name: profile.display_name,
                    email: primary?.email, // <-- this is what NextAuth/Prisma needs
                    image: profile.links.avatar.href,
                };
            }
        }), GitLab({
            clientId: process.env.AUTH_GITLAB_ID,
            clientSecret: process.env.AUTH_GITLAB_SECRET,
        }), HuggingFace({
            clientId: process.env.AUTH_HUGGINGFACE_ID,
            clientSecret: process.env.AUTH_HUGGINGFACE_SECRET,
        })
    ],
    pages: {
        signIn: "/auth/signin",
    }
} satisfies NextAuthConfig