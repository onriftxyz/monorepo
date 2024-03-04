import { pgTable, serial, text, varchar, boolean,timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 256 }).unique(),
  username: varchar("username", { length: 32 }).unique(),
  about: text("about").notNull(),
  onboarded: boolean("onboarded").default(false),
  pfp: text("pfp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
