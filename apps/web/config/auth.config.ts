import GitHub from "next-auth/providers/github"
import Bitbucket from "next-auth/providers/bitbucket"
import GitLab from "next-auth/providers/gitlab"
import HuggingFace from "next-auth/providers/huggingface"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [GitHub, Bitbucket, GitLab, HuggingFace],
} satisfies NextAuthConfig