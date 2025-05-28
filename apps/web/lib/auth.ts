import NextAuth from "next-auth"
import authConfig from "@/config/auth.config"

import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    events: {
        async createUser({ user }) {
            // Create a team named "Personal"
            const team = await prisma.team.create({
                data: {
                    name: `${user.name}'s Team`,
                }
            });

            // Create a team membership for the user as admin
            await prisma.teamMembership.create({
                data: {
                    userId: user.id!,
                    teamId: team.id,
                    role: "admin"
                }
            });
        },
    },
})