import "dotenv/config"
import Fastify from "fastify"
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts"
import authRouter from "./routers/authRouter"
import usersRouter from "./routers/usersRouter"
import cinemasRouter from "./routers/cinemasRouter"
import ExtendedError from "./helpers/ExtendedError"

void (async () => {
  const server = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        allErrors: true
      }
    }
  }).withTypeProvider<JsonSchemaToTsProvider>()


  server.setErrorHandler((error, request, reply) => {
    if (error instanceof ExtendedError) {
      return reply.status(error.errorCode).send({ error: error.message })
    }
    return reply.status(500).send({ error: error.message })
  })

  server.register(require("@fastify/cors"), { origin: "*" })

  server.get("/", async (req, res) => {
    res.send("Server is Alive!")
  })

  server.register(authRouter, { prefix: "/auth" })
  server.register(usersRouter, { prefix: "/users" })
  server.register(cinemasRouter, { prefix: "/cinemas" })

  server.listen({ port: process.env.API_PORT ? Number(process.env.API_PORT) : 3000, host: '0.0.0.0' }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
})()
  .catch(console.error)
