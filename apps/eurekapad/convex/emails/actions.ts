'use node'

import { v } from 'convex/values'
import { Resend } from 'resend'

import { internalAction } from '../_generated/server'
import ShareWithUserEmail from './share'

export const sendShareEmail = internalAction({
  args: {
    email: v.string(),
    isEditor: v.boolean(),
    invitedByName: v.string(),
    invitedByEmail: v.string(),
    documentTitle: v.string(),
    inviteLink: v.string(),
    invitedByImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      throw new Error('Please add RESEND_API_KEY from Resend Dashboard to Convex')
    }

    const resend = new Resend(RESEND_API_KEY)

    const email = args.email
    const isEditor = args.isEditor

    await resend.emails.send({
      from: 'EurekaPad <contact@eurekapad.app>',
      to: email,
      subject: `You have been invited to collaborate on ${args.documentTitle}`,
      react: ShareWithUserEmail({
        email: email,
        invitedByName: args.invitedByName,
        invitedByEmail: args.invitedByEmail,
        isEditor,
        documentName: args.documentTitle,
        inviteLink: args.inviteLink,
        invitedByImage: args.invitedByImage,
      }),
    })
  },
})
