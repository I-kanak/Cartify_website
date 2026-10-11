import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

// Routes that just require the visitor to be signed in.
const protectedPrefixes = ["/store", "/orders", "/create-store"];
// Routes that require an admin account (see ADMIN_EMAILS in .env).
const adminPrefixes = ["/admin"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const { pathname, origin } = nextUrl;

    const isAdminRoute = adminPrefixes.some((p) => pathname.startsWith(p));
    const isProtectedRoute = protectedPrefixes.some((p) => pathname.startsWith(p));

    if (isAdminRoute) {
        if (!req.auth) {
            const signInUrl = new URL("/sign-in", origin);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }
        if (!req.auth.user?.isAdmin) {
            return NextResponse.redirect(new URL("/", origin));
        }
    } else if (isProtectedRoute && !req.auth) {
        const signInUrl = new URL("/sign-in", origin);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
