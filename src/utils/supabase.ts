import {
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import type { NextApiRequest } from "next";
import { env } from "~/env";
import { setCookie, deleteCookie } from "cookies-next";

export function createClient({ req }: { req: NextApiRequest }) {
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          deleteCookie(name, options);
        },
      },
    },
  );

  return supabase;
}
