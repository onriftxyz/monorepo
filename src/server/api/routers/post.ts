import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { posts } from "~/server/api/db/schema";

export const postRouter = createTRPCRouter({
  
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        userId: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.insert(posts).values(input);

        return post;
      } catch (e) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getPosts: publicProcedure.query(() => {
    // TODO: return posts from db
  }),
});
