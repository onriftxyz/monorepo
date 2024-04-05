import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "./db/client";
import { createSupabaseServerClient } from "~/utils/supabase";

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return {
    db,
    supabase: createSupabaseServerClient({ req: _opts.req, res: _opts.res }),
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
export const createTRPCCaller = t.createCallerFactory;

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const user = await ctx.supabase.auth.getUser();
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      user: user.data.user,
    },
  });
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
  const user = await ctx.supabase.auth.getUser();
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const adminEmails = [
    "niggasoul@milind.lol",
    "pybash@skiff.com",
    "hi@pybash.xyz",
  ];

  if (!adminEmails.includes(user.data.user!.email!)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not an admin",
    });
  }

  return next({
    ctx: {
      user: user.data.user,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAdmin);
