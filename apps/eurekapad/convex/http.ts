import { httpRouter } from 'convex/server'

import { clerkCallback } from './clerk'

const http = httpRouter()

http.route({
  path: '/convex/clerk-callback',
  method: 'POST',
  handler: clerkCallback,
})

export default http
