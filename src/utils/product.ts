import type { Tables } from "~/server/api/supabase/types";

type ProductMetadata = { revenue: number; customers: number };

export type UserProductWithStats = Tables<"products"> & ProductMetadata;

export type ProductGet = Tables<"products"> & {
  creator: Tables<"profiles">;
};

export type PurchaseGet = Tables<"purchases"> & {
  product: Tables<"products">;
  buyer: Tables<"profiles">;
};

export type ProductPurchase = Tables<"purchases"> & {
  product: ProductGet
  buyer: Tables<"profiles">;
};

