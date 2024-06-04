import { FastifyPluginCallback, FastifyRequest } from "fastify"
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import "dotenv/config"
import { users } from "../db/schema"
import { and, eq } from "drizzle-orm";
import { createUserJwt } from "../helpers/session";
import ExtendedError from "../helpers/ExtendedError";

//TODO: NON INVIA GLI ERRRORI CORRETTAMENTE

const router: FastifyPluginCallback = async (server, _, done) => {
  const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
  });

  await client.connect();
  const db = drizzle(client);

  // logout with JWT is done client side so we do not need it here
  server.post("/login", async(req : FastifyRequest <{Body: {email: string, password: string}}>, res) => {
    console.log("ciao")
    const [user] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.email, req.body.email),
            eq(users.password, req.body.password)
          )
        )

      if(!user) {
        throw new ExtendedError(400, "Invalid email or password")
      }

      return res.status(200).send({
        message: "OK",
        data: {
          jwt: createUserJwt(user, process.env.JWT_SECRET as string)
        }
      })
  })

  server.post("/register", async(req : FastifyRequest <{Body: {username: string, email: string, password: string, confirmPassword: string}}>, res) => {
    console.log(req.body)
    const user = await db.select().from(users).where(eq(users.email, req.body.email))
      if (user.length > 0) {
        throw new ExtendedError(400, "This email is already used")
      }
      // destructure returning response so we can access data more easily
      const [createdUser] = await db.insert(users).values({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      }).returning()

      return res.status(200).send({
        message: "User registered",
        data: {
          jwt: createUserJwt(createdUser, process.env.JWT_SECRET as string)
        }
      })
  })

  done()
}

export default router
