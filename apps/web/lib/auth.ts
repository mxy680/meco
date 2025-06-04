import NextAuth from "next-auth"
import authConfig from "@/config/auth.config"

import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    events: {
        async createUser({ user }) {
            // Automatically create an organization for the new user
            const org = await prisma.organization.create({
                data: {
                    name: user.name ? `${user.name}'s Organization` : 'Personal Organization',
                    owner: { connect: { id: user.id } },
                    members: {
                        create: [{
                            user: { connect: { id: user.id } },
                            role: 'OWNER',
                        }],
                    },
                },
            });
            // Set this org as the user's active organization
            await prisma.user.update({
                where: { id: user.id },
                data: { activeOrganizationId: org.id },
            });
        },
    },
})