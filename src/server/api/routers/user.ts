import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/api/db/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// typeof users.$inferInsert

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
      const { userDbId } = ctx;
      const updatedUser = await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, userDbId))
        .execute();

      return {
        user: updatedUser,
      };
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { userDbId } = ctx;

    const user = await ctx.db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.id, userDbId))
      .execute();

    return {
      user: user[0],
    };
  }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .limit(1)
        .where(eq(users.email, input.email))
        .execute();

      return user[0];
    }),
});
