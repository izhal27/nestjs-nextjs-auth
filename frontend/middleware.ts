import { auth } from "@/auth";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/auth/signin", "/auth/signup"];

export default function middleware(req: any, ctx: any) {
  return auth((req) => {
    const { nextUrl } = req;
    const isAuthenticated = !!req.auth;

    const isPublicRoute = publicRoutes.some((route) =>
      nextUrl.pathname.startsWith(route),
    );

    const isProtectedRoute = protectedRoutes.some((route) =>
      nextUrl.pathname.startsWith(route),
    );

    // Jika user sudah login dan mengakses home page ("/") atau halaman login/register
    if (nextUrl.pathname === "/" || isPublicRoute) {
      if (isAuthenticated) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
    }

    // Jika user belum login dan mengakses halaman yang dilindungi (seperti /dashboard)
    if (isProtectedRoute && !isAuthenticated) {
      return Response.redirect(new URL("/auth/signin", nextUrl));
    }
  })(req, ctx);
}

export const config = {
  // Hanya jalankan middleware pada rute selain rute api, _next/static, _next/image, dan favicon.ico
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
