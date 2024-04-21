import "dotenv/config"
import Fastify from "fastify"
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts"
import type { User } from "./db/schema"
import authRouter from "./routers/authRouter"
import usersRouter from "./routers/usersRouter"

void (async () => {
  const server = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        allErrors: true
      }
    }
  }).withTypeProvider<JsonSchemaToTsProvider>()

  server.register(require("@fastify/cors"), { origin: "*" })

  server.get("/", async (req, res) => {
    console.log("Hello World")
  })

  server.register(authRouter, { prefix: "/auth" })
  server.register(usersRouter, { prefix: "/users" })

  server.listen({ port: process.env.API_PORT ? Number(process.env.API_PORT) : 3000, host: '0.0.0.0' }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
})()
  .catch(console.error)
