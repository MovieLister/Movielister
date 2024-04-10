import "dotenv/config"
import Fastify from "fastify"
import type { User } from "./db/schema"

const fastify = Fastify({ logger: true })


fastify.get('/', async(request, reply) => {
  return { hello: 'world' }
})

// Run the server!
fastify.listen({ port: process.env.API_PORT ? Number(process.env.API_PORT) : 3000 }).catch((err) => {
  console.error(err)
  process.exit(1)
})
