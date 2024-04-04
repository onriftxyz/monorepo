import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import type { Tables } from "~/server/api/supabase/types";
import { env } from "~/env";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string(),
        twitter: z.string(),
        pfp: z.instanceof(File).optional(),
        onboarded: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx;

      await supabase.auth.updateUser({
        data: {
          name: input.name,
          twitter: input.twitter,
          bio: input.bio,
          pfp: input.pfp,
          onboarded: input.onboarded,
        },
      });
    }),

  onboard: protectedProcedure
    // Use the schema from utils/forms.ts
    .input(
      z.object({
        name: z.string(),
        twitter: z.string().optional(),
        bio: z.string().optional(),
        avatarUploaded: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;
      const metadata = user!.user_metadata;

      if (!metadata.onboarded) {
        
      console.log("image? ", input.avatarUploaded)

        const avatarUrl = input.avatarUploaded
          ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/users/${user?.id}`
          : "";

        console.log("Broooooooooooooooo", avatarUrl);

        supabase.auth
          .updateUser({
            data: {
              name: input.name,
              twitter: input.twitter ?? "",
              bio: input.bio ?? "",
              avatar: avatarUrl,
              onboarded: false,
            },
          })
          .then((user) => {
            return user;
          })
          .catch(() => {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Could not onboard user.",
            });
          });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has already onboarded",
        });
      }
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    return user;
  }),

  getPurchases: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(10),
        offset: z.number().int().gte(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      // TODO: Figure out how to inner join
      const { data, error } = await ctx.supabase
        .from("purchases")
        .select()
        .eq("buyer", ctx.user!.id)
        .range(input.offset, input.offset + input.limit - 1)
        .returns<Tables<"purchases">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  // NOTE:Only for testing onboarding.
  unboard: adminProcedure.query(async ({ ctx }) => {
    const { supabase } = ctx;
    await supabase.auth.updateUser({
      data: {
        onboarded: false,
      },
    });
  }),
});
