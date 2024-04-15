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
  
  server.post("/login", async(req : FastifyRequest <{Body: {email: string, password: string}}>, res) => {
    try{
      const user = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.email, req.body.email),
            eq(users.password, req.body.password)
          )
        )
      
      if(user.length === 0){
        return res.status(400).send({message: "Invalid credentials"})
      }
    }
    catch (error){
      console.log(error)
      return res.status(400).send({message: "Error communicating with the database"})
    }
    return res.status(200).send({message: "Logged in"})

  })

  server.post("/register", async(req : FastifyRequest <{Body: {username: string, email: string, password: string, confirmPassword: string}}>, res) => {
    console.log(req.body)
    try{
      const user = await db.select().from(users).where(eq(users.email, req.body.email))
      if(user.length === 0){
        await db.insert(users).values({ username: req.body.username, email: req.body.email, password: req.body.password })
      }
      else{
        return res.status(400).send({message: "This email is already used"})
      }
    }
    catch (error){
      console.log(error)
      return res.status(400).send({message: "Error communicating with the database"})
    }
    return res.status(200).send({message: "User registered"})
  })

  done()
}

export default router