import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseBrowserClient } from "./utils/supabase";

export const middleware = async (req: NextRequest) => {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const {
    data: { user },
    error: errorUser,
  } = await supabase.auth.getUser();

  console.log("session: ", session);
  console.log("user: ", user);

  if (
    ((!session || !user || errorUser) ?? error) &&
    !(req.nextUrl.pathname === "/")
  )
    return NextResponse.redirect(new URL("/", req.url));

  if (session && user) {
    const { data: user_meta } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .returns<{ onboarded: boolean }>();

    if (!user_meta?.onboarded)
      return NextResponse.redirect(new URL("/onboard", req.url));

    if (req.nextUrl.pathname === "/")
      return NextResponse.redirect(new URL("/home", req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
