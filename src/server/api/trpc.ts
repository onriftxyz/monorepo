import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "./db/client";
import { createClient } from "~/utils/supabase";

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return {
    db,
    supabase: createClient({ req: _opts.req, res: _opts.res }),
    ..._opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const user = await ctx.supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
