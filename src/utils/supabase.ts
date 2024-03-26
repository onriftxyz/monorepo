import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";

export function createClient({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, _options: CookieOptions) {
          res.setHeader(
            "Set-Cookie",
            `${name}=${value}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
          );
        },
        remove(name: string, _options: CookieOptions) {
          res.setHeader(
            "Set-Cookie",
            `${name}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
          );
        },
      },
    },
  );

  return supabase;
}
