import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  generateOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.log("Error while sending OTP", error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string().min(6).max(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.verifyOtp({
        email: input.email,
        token: input.token.toString(),
        type: "email",
      });

      if (error) {
        console.log("Error while verifying token", error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return data;
    }),
  // TODO: A procedure to logout
});
