import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { posts } from "~/server/api/db/schema";

const post = {
  id: 1,
  title: "first post",
  content: "this is the first post",
  userId: 1,
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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
        const client_post = await ctx.db.insert(posts).values(input);
        console.log(client_post);

        return client_post;
      } catch (e) {
        console.log(e);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getLatest: publicProcedure.query(() => {
    return post;
  }),
});
