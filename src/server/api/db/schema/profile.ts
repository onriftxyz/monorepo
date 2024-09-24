import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  onboarded: boolean("onboarded").default(false),
  sphere_wallet_id: text("sphere_wallet_id"),
  twitter: text("twitter"),
  username: text("username").notNull(),
});
