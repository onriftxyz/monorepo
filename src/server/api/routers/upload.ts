import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const uploadRouter = createTRPCRouter({
  getAvatarSignedUrl: protectedProcedure.mutation(async ({ ctx }) => {
    const { supabase, user } = ctx;

    await supabase.storage.from("avatars").remove([`users/${user!.id}`]);

    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUploadUrl(`users/${user?.id}`);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    return data.signedUrl;
  }),

  getProductFileSignedUrl: protectedProcedure
    .input(
      z.object({
        folder: z.enum(["uploads", "markdown", "productImages"]),
        filename: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {

     // NOTE: this seems dangerous any user can upload as many files as possible. need some way to rate limit.

      const { supabase } = ctx;
      const { data, error } = await supabase.storage
        .from("products")
        .createSignedUploadUrl(`${input.folder}/${input.filename}`);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data.signedUrl;
    }),
});
