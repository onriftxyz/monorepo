import type { Tables } from "~/server/api/supabase/types";

type ProductMetadata = { revenue: number, customers: number }

export type UserProductWithStats = Tables<"products"> & ProductMetadata;
