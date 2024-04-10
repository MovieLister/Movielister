import { serial, text, pgTable } from "drizzle-orm/pg-core"

export const users = pgTable("Users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  password: text("password").notNull(),
});


export type User = typeof users.$inferSelect
