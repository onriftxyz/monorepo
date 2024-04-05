import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import type { Tables } from "~/server/api/supabase/types";
import { env } from "~/env";
import fs from "fs";
import { ProductPurchase } from "~/utils/product";

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

      const avatarUrl = input.avatarUploaded
        ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/users/${user?.id}`
        : "";

      if (input.twitter) {
        const pages = fs
          .readdirSync("src/pages")
          .filter((file) => file.endsWith(".tsx"))
          .map((file) => file.replace(".tsx", ""));

        if (pages.includes(input.twitter)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username not allowed",
          });
        }
      }

      const userProfile = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single<Tables<"profiles">>();

      if (userProfile.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: userProfile.error.message,
        });
      }

      if (userProfile.data.onboarded) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User already onboarded",
        });
      }

      const { data, error } = await supabase
        .from("profiles")
        .update([
          {
            name: input.name,
            twitter: input.twitter ?? "",
            bio: input.bio ?? "",
            avatar: avatarUrl,
            onboarded: true,
          },
        ])
        .eq("id", user!.id)
        .returns<Tables<"profiles">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not onboard user: " + error.message,
        });
      }

      return data;
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const { data, error } = await ctx.supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single<Tables<"profiles">>();

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    return {
      user,
      profile: data,
    };
  }),

  purchases: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(10),
        offset: z.number().int().gte(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("purchases")
        .select("*, product:products (*) ")
        .eq("buyer", ctx.user!.id)
        .range(input.offset, input.offset + input.limit - 1)
        .returns<ProductPurchase[]>();

      console.log("My id", ctx.user!.id, "data", data);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    type IdViewSelect = {
      id: Tables<"products">["id"];
      views: Tables<"products">["views"];
    }[];

    const userProductViewsSelect = await supabase
      .from("products")
      .select("id, views")
      .eq("creator", user!.id)
      .returns<IdViewSelect>();

    if (userProductViewsSelect.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: userProductViewsSelect.error.message,
      });
    }

    const userProductViews = userProductViewsSelect.data;
    const productIds = userProductViews.map((post) => post.id);

    type BuyerAmountSelect = {
      buyer: Tables<"purchases">["buyer"];
      amount: Tables<"purchases">["amount"];
    }[];

    const usersPostPurchasesSelect = await supabase
      .from("purchases")
      .select("buyer, amount")
      .in("product", productIds)
      .returns<BuyerAmountSelect>();

    if (usersPostPurchasesSelect.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: usersPostPurchasesSelect.error.message,
      });
    }
    const userProductPurchases = usersPostPurchasesSelect.data;

    const totalViews = userProductViews.reduce(
      (acc, post) => acc + post.views,
      0,
    );

    const totalRevenue = userProductPurchases.reduce(
      (acc, purchase) => acc + purchase.amount,
      0,
    );

    const uniqueBuyers = new Set(
      userProductPurchases.map((purchase) => purchase.buyer),
    ).size;

    return {
      totalViews,
      totalRevenue,
      uniqueBuyers,
    };
  }),

  profile: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("profiles")
        .select("*")
        .eq("id", input.id)
        .single<Tables<"profiles">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),
});
