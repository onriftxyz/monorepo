import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/api/db/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        about: z.string(),
        pfp: z.string(),
        onboarded: z.boolean(),
        // updateAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;
      const metadata = user!.user_metadata;

      if (!metadata.onboarded) {
        await supabase.auth.updateUser({
          data: {
            name: input.name,
            username: input.username,
            about: input.about,
            pfp: input.pfp,
            onboarded: input.onboarded,
          },
        });
      }
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    return user;
  }),
});
