import { auth } from '@clerk/nextjs/server'

export const getAuthToken = async () => {
  const token = await (await auth()).getToken({ template: 'convex' })
  if (!token) {
    throw new Error('Clerk is unauthenticated')
  }

  return token
}
