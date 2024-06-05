import { serial, text, pgTable, json } from "drizzle-orm/pg-core"

export const users = pgTable("Users", {
  id: serial("id").primaryKey(),
  username: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  favourites: json("favourites").default([]),
});

export const cinemas = pgTable("Cinemas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
});


export type User = typeof users.$inferSelect
export type UserFront = Pick<User, "id" | "username" | "email" | "favourites">
export type Cinema = typeof cinemas.$inferSelect
