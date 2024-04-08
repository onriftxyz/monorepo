import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Tables } from "../supabase/types";
import {
  type SphereCreatePaymentLink,
  type SphereCreatePrice,
  type SphereCreateWallet,
} from "~/utils/spherepay";
import { env } from "~/env";
import { z } from "zod";

export const paymentRouter = createTRPCRouter({
  createWallet: protectedProcedure.mutation(async ({ ctx }) => {
    const { user, supabase } = ctx;

    const { data: wallet, error: getProfileError } = await supabase
      .from("profiles")
      .select("wallet")
      .eq("id", user!.id)
      .single<Tables<"profiles">["wallet"]>();

    if (getProfileError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: getProfileError.message,
      });
    }

    if (!wallet) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not have a wallet",
      });
    }

    const data = {
      wallet: wallet,
      network: "sol",
    };

    const URL = "https://api.spherepay.co/v1/wallet";

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SPHERE_API_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create wallet",
      });
    }

    // Idk what to do with this data?
    const walletData = (await response.json()) as SphereCreateWallet;

    if (walletData.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: walletData.error.message,
      });
    }

    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        sphere_wallet_id: walletData.data.wallet.id,
      })
      .eq("id", user!.id);

    if (updateProfileError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: updateProfileError.message,
      });
    }

    return walletData;
  }),

  createPrice: protectedProcedure
    .input(
      z.object({
        product_id: z.number().int().positive(),
        price: z.number().gte(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user, supabase } = ctx;

      // Get product from db

      const { data: product, error: getProductError } = await supabase
        .from("products")
        .select("*")
        .eq("id", input.product_id)
        .single<Tables<"products">>();

      if (getProductError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: getProductError.message,
        });
      }

      if (product.creator !== user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not own this product",
        });
      }

      const URL = "https://api.spherepay.co/v1/price";

      if (!product.sphere_product_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product does not have a sphere product id",
        });
      }

      const data = {
        product: product.sphere_product_id,
        currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        billingScheme: "perUnit",
        unitAmountDecimal: input.price ?? product.price,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.SPHERE_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create price",
        });
      }

      const spherePriceData = (await response.json()) as SphereCreatePrice;

      if (spherePriceData.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: spherePriceData.error.message,
        });
      }

      const { error: updateProductError } = await supabase
        .from("products")
        .update({
          sphere_price_id: spherePriceData.data.price.id,
        })
        .eq("id", input.product_id);

      if (updateProductError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateProductError.message,
        });
      }

      return spherePriceData;
    }),

  createPaymentLink: protectedProcedure
    .input(
      z.object({
        product_id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data: product, error: getProductError } = await ctx.supabase
        .from("products")
        .select("*")
        .eq("id", input.product_id)
        .single<Tables<"products">>();

      if (getProductError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: getProductError.message,
        });
      }

      const { data: creator, error: getCreatorError } = await ctx.supabase
        .from("profiles")
        .select()
        .eq("id", product.creator)
        .single<Tables<"profiles">>();

      if (getCreatorError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: getCreatorError.message,
        });
      }

      if (!creator.sphere_wallet_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Creator does not have a sphere wallet id",
        });
      }

      const URL = "https://api.spherepay.co/v1/paymentLink";

      const data = {
        lineItems: [
          {
            name: product.title,
            description: product.description,
            price: product.sphere_price_id,
            quantity: 1,
            quantityMutable: false,
          },
        ],
        meta: {
          buyer: ctx.user!.id,
          product: product.id,
        },
        successUrl: `${env.NEXT_PUBLIC_APP_URL}/checkout?type=SUCCESS`,
        failureUrl: `${env.NEXT_PUBLIC_APP_URL}/checkout?type=FAILURE`,
        wallets: [
          {
            id: env.RIFT_SPHERE_WALLET_ID,
            shareBps: 1000,
          },
          {
            id: creator.sphere_wallet_id,
            shareBps: 9000,
          },
        ],
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.SPHERE_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment link",
        });
      }

      const spherePaymentLinkData =
        (await response.json()) as SphereCreatePaymentLink;

      if (spherePaymentLinkData.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: spherePaymentLinkData.error.message,
        });
      }

      return spherePaymentLinkData.data;
    }),
});
