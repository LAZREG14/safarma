// ══════════════════════════════════════════
// SaFarma — Middleware de Protection
// ══════════════════════════════════════════
// En mode démo : pas de vérification côté serveur.
// En production : décommenter le code Supabase ci-dessous.
//
// Pour activer la protection Supabase :
// 1. npm install @supabase/ssr
// 2. Décommenter tout le bloc ci-dessous
// 3. Supprimer l'export actuel

import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Mode démo : laisse passer toutes les requêtes
  return NextResponse.next();

  // ─── PRODUCTION (décommenter) ───
  // import { createServerClient } from "@supabase/ssr";
  //
  // const response = NextResponse.next({ request });
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       getAll: () => request.cookies.getAll(),
  //       setAll: (cookiesToSet) => {
  //         cookiesToSet.forEach(({ name, value, options }) => {
  //           response.cookies.set(name, value, options);
  //         });
  //       },
  //     },
  //   }
  // );
  //
  // const { data: { user } } = await supabase.auth.getUser();
  //
  // if (!user && !request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  //
  // if (user && request.nextUrl.pathname === "/login") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }
  //
  // return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
