import { WebhookEvent } from '@clerk/nextjs/server'
import { httpRouter } from 'convex/server'
import { Resend } from 'resend'
import { Webhook } from 'svix'

import { httpAction } from './_generated/server'
import { signupEmailHTML } from './emails/signup'

const http = httpRouter()

// https://clerk.com/docs/integrations/webhooks/sync-data
export const clerkCallback = httpAction(async (ctx, request) => {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = request.headers
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await request.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  if (evt.type === 'user.created') {
    const email = evt.data.email_addresses.length > 0 ? evt.data.email_addresses[0].email_address : null
    const firstName = evt.data.first_name
    const lastName = evt.data.last_name
    if (email && firstName) {
      console.log(`User ${firstName} with email ${email} was created`)

      const RESEND_API_KEY = process.env.RESEND_API_KEY
      const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

      if (!RESEND_API_KEY) {
        throw new Error('Please add RESEND_API_KEY from Resend Dashboard to Convex')
      }

      if (!RESEND_AUDIENCE_ID) {
        throw new Error('Please add RESEND_AUDIENCE_ID from Resend Dashboard to Convex')
      }

      const resend = new Resend(RESEND_API_KEY)

      // Add user to the audience list
      const { error: contactError } = await resend.contacts.create({
        email,
        firstName,
        lastName: lastName || undefined,
        unsubscribed: false,
        audienceId: RESEND_AUDIENCE_ID,
      })

      // Send welcome email
      const { data, error } = await resend.emails.send({
        from: 'Zayne from EurekaPad <contact@eurekapad.app>',
        to: [email],
        subject: `Welcome to EurekaPad, ${firstName}!`,
        html: signupEmailHTML(firstName),
      })

      if (error || contactError) {
        return new Response(JSON.stringify(error || contactError), {
          status: 500,
        })
      }
      return new Response(JSON.stringify(data), {
        status: 200,
      })
    }
  }

  return new Response('', { status: 200 })
})

http.route({
  path: '/convex/clerk-callback',
  method: 'POST',
  handler: clerkCallback,
})

export default http
