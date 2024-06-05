import { FastifyPluginCallback, FastifyRequest } from "fastify"
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import "dotenv/config"
import { Cinema, cinemas } from "../db/schema";


const router: FastifyPluginCallback = async (server, _, done) => {
  const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
  });

  await client.connect();
  const db = drizzle(client);

  server.post("/getCinemas", async(req, res) => {
    const cinemasList : Cinema[] = await db.select().from(cinemas)
    return res.status(200).send(cinemasList)
  })

  done()
}

export default router
