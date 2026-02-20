import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/config/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!admin || !admin.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    admin.password
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: admin.id.toString(),
                    name: admin.name,
                    email: admin.email,
                };
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
});
