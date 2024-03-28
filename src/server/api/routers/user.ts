import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        about: z.string(),
        pfp: z.string(),
        onboarded: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx;

      await supabase.auth.updateUser({
        data: {
          name: input.name,
          username: input.username,
          about: input.about,
          pfp: input.pfp,
          onboarded: input.onboarded,
        },
      });
    }),

  onboard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        about: z.string(),
        pfp: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;
      const metadata = user!.user_metadata;

      if (!metadata.onboarded) {
        supabase.auth
          .updateUser({
            data: {
              name: input.name,
              username: input.username,
              about: input.about,
              pfp: input.pfp,
              onboarded: true,
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

  // NOTE:Only for testing onboarding.
  unboard: adminProcedure.query(async ({ ctx }) => {
    const { supabase } = ctx;
    const user = await supabase.auth.updateUser({
      data: {
        onboarded: false,
      },
    });

    return user.data.user; 
  }),
});
