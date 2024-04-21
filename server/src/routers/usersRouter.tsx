import { FastifyPluginCallback, FastifyRequest } from "fastify"
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import "dotenv/config"
import { users } from "../db/schema"
import { and, eq } from "drizzle-orm";


const router: FastifyPluginCallback = async (server, _, done) => {
  const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
  });

  await client.connect();
  const db = drizzle(client);
  
  server.post("/getUser", async (req : FastifyRequest <{Body: {email: string}}>, res) => {
    const user = await db.select().from(users).where(eq(users.email, req.body.email))
    console.log(user)
    return res.send({user : user[0]})
  })

  server.post("/changeUsername", async (req : FastifyRequest <{Body: {email: string, newUsername: string, newPassword: string, newEmail: string}}>, res) => {
    console.log(req.body)
    if(req.body.newUsername !== "") await db.update(users).set({username: req.body.newUsername}).where(eq(users.email, req.body.email))
    if(req.body.newPassword !== "") await db.update(users).set({password: req.body.newPassword}).where(eq(users.email, req.body.email))
    if(req.body.newEmail !== "") await db.update(users).set({email: req.body.newEmail}).where(eq(users.email, req.body.email))
    
    const user = await db.select().from(users).where(eq(users.email, req.body.email))
    return res.send({user : user[0]})
  })

  done()
}

export default router