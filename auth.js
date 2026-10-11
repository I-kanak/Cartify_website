import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import prisma from "@/lib/prisma";

// Full NextAuth config (Node runtime). Adds database sync on top of the
// edge-safe config: every sign-in upserts the user into the database, and
// emails listed in ADMIN_EMAILS get admin access.
const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user }) {
            if (!user?.email) return false;
            const isAdmin = adminEmails.includes(user.email.toLowerCase());

            try {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: { name: user.name || "User", image: user.image || "", isAdmin },
                    create: {
                        id: user.id,
                        name: user.name || "User",
                        email: user.email,
                        image: user.image || "",
                        isAdmin,
                    },
                });
            } catch (err) {
                console.error(
                    "[cartify] Could not save the user to the database. " +
                    "Did you run `npm run db:setup`? Original error:",
                    err
                );
                return false;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.isAdmin = dbUser.isAdmin;
                }
            }
            return token;
        },
    },
});
