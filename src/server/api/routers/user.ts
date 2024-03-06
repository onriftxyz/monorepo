import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { users } from "~/server/api/db/schema";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        pfp: z.string(),
        about: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.insert(users).values(input);

        console.log(user);

        return user;
      } catch (e) {
        console.log(e);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
