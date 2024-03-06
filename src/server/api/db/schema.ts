import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 256 }).unique(),
  username: varchar("username", { length: 32 }).unique(),
  about: text("about"),
  onboarded: boolean("onboarded").default(false),
  pfp: text("pfp"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content"),
  views: integer("views").notNull().default(0),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});