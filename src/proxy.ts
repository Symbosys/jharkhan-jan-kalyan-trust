// import { NextRequest, NextResponse } from "next/server";

// export function proxy(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     const isAdminRoute = pathname.startsWith("/admin");
//     const isLoginRoute = pathname === "/login";

//     // Optimistic cookie check — lightweight, no DB call
//     const sessionCookie =
//         request.cookies.get("authjs.session-token") ||
//         request.cookies.get("__Secure-authjs.session-token");

//     // Not logged in → redirect to login
//     if (isAdminRoute && !isLoginRoute && !sessionCookie) {
//         return NextResponse.redirect(new URL("/login", request.url));
//     }

//     // Already logged in → redirect away from login page to admin
//     // Removed to prevent infinite loop when session cookie exists but is invalid (e.g., missing AUTH_SECRET)
//     // if (isLoginRoute && sessionCookie) {
//     //     return NextResponse.redirect(new URL("/admin", request.url));
//     // }

//     return NextResponse.next();
// }



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const maintenanceMode = true;

  if (maintenanceMode) {
    return new NextResponse(
      `
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center;">
            <h1>Something went wrong</h1>
            <button 
  onclick="window.location.reload()" 
  style="
    background-color:#dc2626;
    color:white;
    border:none;
    padding:12px 24px;
    font-size:16px;
    font-weight:600;
    border-radius:8px;
    cursor:pointer;
    box-shadow:0 4px 14px rgba(220,38,38,0.4);
    transition:all 0.2s ease;
  "
  onmouseover="this.style.backgroundColor='#b91c1c'; this.style.transform='translateY(-1px)'"
  onmouseout="this.style.backgroundColor='#dc2626'; this.style.transform='translateY(0)'"
>
  Retry
</button>
          </div>
        </body>
      </html>
      `,
      {
        status: 503,
        headers: { "content-type": "text/html" },
      }
    );
  }

  return NextResponse.next();
}