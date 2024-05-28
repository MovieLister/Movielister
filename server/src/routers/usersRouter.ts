import { FastifyPluginCallback, FastifyRequest } from "fastify"
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import "dotenv/config"
import { users } from "../db/schema"
import { and, eq } from "drizzle-orm";
import { createUserJwt, verifyUser } from "../helpers/session";


const router: FastifyPluginCallback = async (server, _, done) => {
  const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
  });

  await client.connect();
  const db = drizzle(client);

  // this is a request that requires authentication
  server.post("/getSelfUser", async(req, res) => {
    // check for authentication and get user data from jwt in req
    const user = await verifyUser(req, res, db)
    return res.status(200).send(user)
  })

  done()
}

export default router
