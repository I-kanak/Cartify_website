import Google from "next-auth/providers/google";

// Edge-safe part of the NextAuth config (no database imports).
// Used by middleware.js, which runs in the Edge runtime where Prisma can't run.
export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.isAdmin = Boolean(token.isAdmin);
            }
            return session;
        },
    },
};
