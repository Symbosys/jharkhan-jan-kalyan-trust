import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginRoute = pathname === "/login";

    // Optimistic cookie check — lightweight, no DB call
    const sessionCookie =
        request.cookies.get("authjs.session-token") ||
        request.cookies.get("__Secure-authjs.session-token");

    // Not logged in → redirect to login
    if (isAdminRoute && !isLoginRoute && !sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Already logged in → redirect away from login page to admin
    if (isLoginRoute && sessionCookie) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}
