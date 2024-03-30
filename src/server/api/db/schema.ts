// import {
//   pgTable,
//   serial,
//   text,
//   varchar,
//   boolean,
//   timestamp,
//   integer,
// } from "drizzle-orm/pg-core";
//
// // Get the pg column from the schema auth.user.id
//
// const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: varchar("name"),
//   username: varchar("username"),
//   about: text("about"),
//   pfp: text("pfp"),
//   onboarded: boolean("onboarded").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });
//
// export const posts = pgTable("posts", {
//   id: serial("id").primaryKey(),
//   title: text("title"),
//   content: text("content"),
//   views: integer("views").notNull().default(0),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => ),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });
