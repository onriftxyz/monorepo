import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import type { Tables } from "~/server/api/supabase/types";
import { type ProductGet } from "~/utils/product";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
        content: z.array(z.string().min(1)),
        type: z.enum(["LINK", "UPLOAD", "MARKDOWN"]),
        price: z.number().gte(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .insert({
          title: input.title,
          description: input.description,
          images: input.images,
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
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .select("*, creator:profiles!public_products_creator_fkey(*)")
        .eq("id", input.id)
        .limit(1)
        .returns<ProductGet>();

      if (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  getByCreator: publicProcedure
    .input(
      z.object({
        creator: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("products")
        .select("*, creator:profiles!public_products_creator_fkey(*)")
        .eq("creator", input.creator)
        .returns<ProductGet[]>();

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
        .select("*, creator:profiles!public_products_creator_fkey(*)")
        .range(input.offset, input.offset + input.limit - 1)
        .returns<ProductGet[]>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),

  getMine: protectedProcedure.query(async ({ ctx }) => {
    const { supabase, user } = ctx;

    const userProductsSelect = await supabase
      .from("products")
      .select("*, creator:profiles!public_products_creator_fkey(*)")
      .eq("creator", user!.id)
      .returns<ProductGet[]>();

    if (userProductsSelect.error) {
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: userProductsSelect.error.message,
      });
    }

    const userProducts = userProductsSelect.data;

    const productIds = userProducts.map((product) => product.id);

    type ProductBuyerAmountSelect = {
      product: Tables<"purchases">["product"];
      buyer: Tables<"purchases">["buyer"];
      amount: Tables<"purchases">["amount"];
    }[];

    const usersPostPurchasesSelect = await supabase
      .from("purchases")
      .select("buyer, amount, product")
      .in("product", productIds)
      .returns<ProductBuyerAmountSelect>();

    if (usersPostPurchasesSelect.error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: usersPostPurchasesSelect.error.message,
      });
    }

    const userProductPurchases = usersPostPurchasesSelect.data;

    const userProductsWithStats = userProducts.map((product) => {
      const purchases = userProductPurchases.filter(
        (purchase) => purchase.product === product.id,
      );

      return {
        ...product,
        revenue: purchases.reduce((acc, { amount }) => acc + amount, 0),
        customers: new Set(purchases.map(({ buyer }) => buyer)).size,
      };
    });

    return userProductsWithStats;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        content: z.string().array().min(1).optional(),
        price: z.number().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data: product, error } = await ctx.supabase
        .from("products")
        .select("*")
        .eq("id", input.id)
        .returns<ProductGet>();

      if (!product || error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      const { data, error: updateError } = await ctx.supabase
        .from("products")
        .update({
          title: input.title ?? product.title,
          description: input.description ?? product.description,
          content: input.content ?? product.content,
          price: input.price ?? product.price,
          images: product.images
            ?.concat(input.image ?? "")
            .filter((img) => !!img),
          creator: ctx.user!.id,
        })
        .eq("id", input.id)
        .select()
        .returns<Tables<"products">>();

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: updateError.message,
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

  purchase: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        transcation_id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const productSelect = await ctx.supabase
        .from("products")
        .select()
        .eq("id", input.id)
        .limit(1)
        .returns<Tables<"products">>();

      if (productSelect.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: productSelect.error.message,
        });
      }

      if (productSelect.data.creator == ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't purchase your own product",
        });
      }

      const { data, error } = await ctx.supabase
        .from("purchases")
        .insert({
          product: input.id,
          buyer: ctx.user!.id,
          transcation_id: input.transcation_id,
          amount: productSelect.data.price,
        })
        .select()
        .returns<Tables<"purchases">>();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data.product;
    }),

  mostPurchased: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(10),
        offset: z.number().int().gte(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      // TODO: SQL Query for when we move to an ORM
      //SELECT p.*, COUNT(pu.product) AS total_purchases
      // FROM products p
      // JOIN purchases pu ON p.id = pu.product
      // GROUP BY p.id
      // ORDER BY total_purchases DESC

      const { data: purchases, error } = await ctx.supabase
        .from("purchases")
        .select("product: products(id)")
        .returns<{ product: { id: number } }[]>();

      console.log(purchases);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      // HACK: So hacky it's not even funny, imma throw up.

      const productIds = purchases.map(({ product }) => product.id);

      const { data: products, error: errorProduct } = await ctx.supabase
        .from("products")
        .select("*, creator:profiles!public_products_creator_fkey(*)")
        .in("id", productIds)
        .returns<ProductGet[]>();

      if (errorProduct) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: errorProduct.message,
        });
      }

      const productsWithPurchases = products.map((product) => {
        const totalPurchases = purchases.filter(
          (purchase) => purchase.product.id === product.id,
        ).length;
        return {
          ...product,
          purchases: totalPurchases,
        };
      });

      const sortedProducts = productsWithPurchases.sort(
        (a, b) => b.purchases - a.purchases,
      );

      return sortedProducts.slice(input.offset, input.offset + input.limit);
    }),

  stats: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      type IdViewCreatorSelect = {
        id: Tables<"products">["id"];
        views: Tables<"products">["views"];
        creator: Tables<"products">["creator"];
      }[];

      const productViewsSelect = await supabase
        .from("products")
        .select("id, views, creator")
        .eq("id", input.id)
        .limit(1)
        .returns<IdViewCreatorSelect>();

      if (productViewsSelect.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: productViewsSelect.error.message,
        });
      }

      if (productViewsSelect.data.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such product exists",
        });
      }

      const productViews = productViewsSelect.data[0];

      if (productViews?.creator != user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view stats of your products",
        });
      }

      type BuyerAmountSelect = {
        buyer: Tables<"purchases">["buyer"];
        amount: Tables<"purchases">["amount"];
      }[];

      const buyerAmountSelect = await supabase
        .from("purchases")
        .select("buyer, amount")
        .eq("product", input.id)
        .returns<BuyerAmountSelect>();

      if (buyerAmountSelect.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: buyerAmountSelect.error.message,
        });
      }

      const buyersAmount = buyerAmountSelect.data;

      return {
        views: productViews?.views ?? 0,
        buyers: new Set(buyersAmount.map(({ buyer }) => buyer)).size,
        revenue: buyersAmount.reduce((acc, { amount }) => acc + amount, 0),
      };
    }),

  isPurchased: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const { user, supabase } = ctx;

      const purchaseSelect = await supabase
        .from("purchases")
        .select()
        .eq("product", input.id)
        .eq("buyer", user!.id)
        .returns<Tables<"purchases">[]>();

      if (purchaseSelect.error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: purchaseSelect.error.message,
        });
      }

      return purchaseSelect.data.length > 0;
    }),
});
