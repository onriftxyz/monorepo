import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profile } from "./profile";

export const contentType = pgEnum("content_type", [
  "LINK",
  "UPLOAD",
  "MARKDOWN",
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  sphere_price_id: text("sphere_price_id"),
  sphere_product_id: text("sphere_product_id"),
  content: text("content").array(),
  images: text("images").array(),
  type: contentType("type").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  views: integer("views").default(0),
  creator: uuid("creator").references(() => profile.id, {
    onDelete: "set null",
  }),
});
