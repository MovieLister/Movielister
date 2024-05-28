import { FastifyReply, FastifyRequest } from "fastify";
import { User, UserFront, users } from "../db/schema";
import * as jwt from "jsonwebtoken"
import ExtendedError from "./ExtendedError";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

export const createUserJwt = (user: User, secret: string): string => {
  return jwt.sign({
    id: user.id
  }, secret)
}

export const verifyUser = async(req: FastifyRequest, res: FastifyReply, db: NodePgDatabase): Promise<UserFront> => {
  if (!req.headers.authorization) {
    throw new ExtendedError(401, "Unauthorized")
  }
  const token = req.headers.authorization.replace("Bearer", "").trim()
  const { id } = verifyUserJwt(token, process.env.JWT_SECRET as string)

  const [user] = await db.select({
    id: users.id,
    email: users.email,
    username: users.username
  }).from(users).where(eq(users.id, parseInt(id)))

  if (!user) {
    throw new ExtendedError(404, "User not found")
  }

  return user
}

export const verifyUserJwt = (token: string, secret: string): { id: string } => {
  return jwt.verify(token, secret) as { id: string }
}
