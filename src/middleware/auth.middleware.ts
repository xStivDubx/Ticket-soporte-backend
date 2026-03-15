import { Context, Next } from "hono"
import { verify } from "hono/jwt"
import { env } from "../config/env"

export const authMiddleware = async (c: Context, next: Next) => {

  // obtener header Authorization
  const authHeader = c.req.header("Authorization")

  if (!authHeader) {
    return c.json({ message: "Favor de iniciar sesión[1]" }, 401)
  }

  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Favor de iniciar sesión[2]" }, 401)
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return c.json({ message: "Favor de iniciar sesión[3]" }, 401)
  }

  try {

    // verificar token
    const payload = await verify(token, env.JWT_SECRET!,'HS256')

    // guardar datos del usuario en el contexto
    c.set("user", payload)
    await next()

  } catch (error) {
    return c.json({ message: "Favor de iniciar sesión[4]" }, 401)
  }
}