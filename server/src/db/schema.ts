import { serial, text, pgTable } from "drizzle-orm/pg-core"

export const users = pgTable("Users", {
  id: serial("id").primaryKey(),
  username: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});


export type User = typeof users.$inferSelect
