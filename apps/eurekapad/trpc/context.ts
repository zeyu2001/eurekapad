import { getAuth } from '@clerk/nextjs/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

export const createContext = ({ req }: CreateNextContextOptions) => {
  const { userId } = getAuth(req)

  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

  return { userId, token }
}

export type Context = ReturnType<typeof createContext>
