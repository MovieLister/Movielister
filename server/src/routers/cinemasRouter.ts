import { FastifyPluginCallback, FastifyRequest } from "fastify"
import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import "dotenv/config"
import { Cinema, cinemas } from "../db/schema";
import { pool } from "../helpers/pool";


const router: FastifyPluginCallback = async (server, _, done) => {
  

  server.post("/getCinemas", async(req, res) => {
    const db = drizzle(pool);
    const cinemasList : Cinema[] = await db.select().from(cinemas)
    return res.status(200).send(cinemasList)
  })

  done()
}

export default router
