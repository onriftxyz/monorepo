import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from 'drizzle-orm';


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
        const client_post = await ctx.db.insert(posts).values(input);
        return client_post;
      } catch (e) {
        console.log(e);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

    delete: publicProcedure
  .input(z.object({ id: z.number().int().positive() }))
  .mutation(async ({ ctx, input }) => {
    try {
      const deleted_post = await ctx.db.delete(posts).where(eq(posts.id, input.id)).returning();
      return deleted_post;
    } catch (e) {
      console.log(e);
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getPosts: publicProcedure.input(z.object({
    userId: z.number().int().positive()
  })).mutation(async({ctx,input}) => {
    try {
      const Posts = await ctx.db.select().from(posts).where(eq(posts.userId, input.userId))
      return Posts;
    } catch (e) {
      console.log(e);
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
