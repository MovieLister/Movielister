import { FastifyPluginCallback, FastifyRequest } from "fastify"
import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import "dotenv/config"
import { users } from "../db/schema"
import { and, eq } from "drizzle-orm";
import { createUserJwt, verifyUser } from "../helpers/session";
import { pool } from "../helpers/pool";


const router: FastifyPluginCallback = async (server, _, done) => {

  // this is a request that requires authentication
  server.post("/getSelfUser", async(req, res) => {
    console.log("autorization: ", req.headers.authorization)
    const db = drizzle(pool);
    // check for authentication and get user data from jwt in req
    const user = await verifyUser(req, res, db)
    console.log("USER: ", user)
    return res.status(200).send(user)
  })

  server.post("/addFavourite", async(req : FastifyRequest <{Body: {favourite: string}}>, res) => {
    const db = drizzle(pool);
    // check for authentication and get user data from jwt in req
    const user = await verifyUser(req, res, db)
    console.log(req.body.favourite)
    const userFavourites : [string]= user.favourites as [string]
    userFavourites.push(req.body.favourite)
    // add favourite to user
    await db.update(users).set({ favourites: userFavourites }).where(eq(users.id, user.id))
    return res.status(200).send({
      message: "Favourite added"
    })
  })

  server.post("/removeFavourite", async(req : FastifyRequest <{Body: {favourite: string}}>, res) => {
    const db = drizzle(pool);
    // check for authentication and get user data from jwt in req
    const user = await verifyUser(req, res, db)
    const userFavourites : [string]= user.favourites as [string]
    // remove favourite from user
    await db.update(users).set({ favourites: userFavourites.filter(f => f !== req.body.favourite) }).where(eq(users.id, user.id))
    return res.status(200).send({
      message: "Favourite removed"
    })
  })

  done()
}

export default router
