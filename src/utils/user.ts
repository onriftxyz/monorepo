import { type Tables } from "~/server/api/supabase/types";

export type UserGet = Tables<"profiles"> & { profile: Tables<"profiles"> };
