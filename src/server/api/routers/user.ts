import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/api/db/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        about: z.string(),
        pfp: z.string(),
        onboarded: z.boolean(),
        updateAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {};
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated",
      });
    }

    return user;
  }),
});
