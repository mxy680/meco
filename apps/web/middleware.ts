import NextAuth from "next-auth"
import authConfig from "@/config/auth.config"
 
export const { auth: middleware } = NextAuth(authConfig)