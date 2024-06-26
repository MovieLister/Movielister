import { defineConfig } from "drizzle-kit"
import "dotenv/config"



export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.PG_CONNECTION_STRING as string,
  },
  verbose: true,
  strict: true,
  out: "./migrations"
})
