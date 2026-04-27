import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe конфиг Auth.js v5: сюда не попадают Credentials.authorize,
 * bcrypt и обращение к БД, чтобы middleware (Edge runtime) импортировал
 * только этот файл. Полный конфиг с провайдером — в src/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnApiUpload = nextUrl.pathname.startsWith("/api/upload");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      if (isOnAdmin || isOnApiUpload) {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
