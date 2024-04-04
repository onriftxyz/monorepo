import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import type { Tables } from "~/server/api/supabase/types";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.array(z.string().min(1)),
        type: z.enum(["LINK", "UPLOAD", "MARKDOWN"]),
        price: z.number().gte(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .upsert({
          title: input.title,
          content: input.content,
          price: input.price,
          type: input.type,
          creator: ctx.user!.id,
        })
        .select()
        .returns<Tables<"products">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  get: publicProcedure
    .input(
      z.object({
        creator: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .select()
        .eq("creator", input.creator)
        .returns<Tables<"products">>();

      if (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  mine: protectedProcedure.query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from("products")
      .select()
      .eq("creator", ctx.user!.id)
      .returns<Tables<"products">[]>();

    if (error) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    return data;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .upsert({
          id: input.id,
          title: input.title,
          content: input.content,
          creator: ctx.user!.id,
        })
        .select()
        .returns<Tables<"products">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .delete()
        .match({ id: input.id, creator: ctx.user!.id });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(10),
        offset: z.number().int().gte(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .select("*")
        .range(input.offset, input.offset + input.limit - 1)
        .returns<Tables<"products">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  purchase: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("purchases")
        .upsert({
          product: input.id,
          buyer: ctx.user!.id,
        })
        .select()
        .returns<Tables<"purchases">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),
});
