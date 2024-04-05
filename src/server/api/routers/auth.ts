import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Tables } from "../supabase/types";

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
          data: {
            onboarded: false,
          },
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
      const verifyOtpCall = await ctx.supabase.auth.verifyOtp({
        email: input.email,
        token: input.token.toString(),
        type: "email",
      });

      if (verifyOtpCall.error) {
        console.log("Error while verifying token", verifyOtpCall.error);
        throw new TRPCError({
          message: verifyOtpCall.error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      let profile: Tables<"profiles"> | null = null;

      if (!verifyOtpCall.data?.user?.email_confirmed_at === null) {
        const { data, error } = await ctx.supabase
          .from("profiles")
          .insert({
            id: verifyOtpCall.data.user!.id,
          })
          .eq("id", verifyOtpCall.data.user!.id)
          .returns<Tables<"profiles">>();

        if (error) {
          throw new TRPCError({
            message: "Error while creating user profile: " + error.message,
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        profile = data;
      } else {
        const { data, error } = await ctx.supabase
          .from("profiles")
          .select("*")
          .eq("id", verifyOtpCall.data.user!.id)
          .single<Tables<"profiles">>();

        if (error) {
          throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        profile = data;
      }

      const userData = {
        data: verifyOtpCall.data,
        profile: profile,
      };

      console.log(userData);

      return userData;
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const { error } = await ctx.supabase.auth.signOut();

    if (error) {
      console.log("Error while logging out", error);
      throw new TRPCError({
        message: error.message,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
