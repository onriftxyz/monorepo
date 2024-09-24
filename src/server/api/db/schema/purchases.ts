import { numeric, pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { products } from "./products";
import { profile } from "./profile";

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(), // Use uuid instead of text
  product: uuid("product").references(() => products.id, {
    // Use uuid instead of text for foreign key
    onDelete: "cascade",
  }),
  buyer: uuid("buyer").references(() => profile.id, { onDelete: "cascade" }), // Use uuid instead of text for foreign key
  amount: numeric("amount").notNull(),
  transaction_id: text("transaction_id").notNull(),
  purchased_at: timestamp("purchased_at").notNull(), // Use timestamp instead of text
});
