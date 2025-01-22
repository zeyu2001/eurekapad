import { z } from 'zod'

const imagesSchema = z.array(
  z
    .string()
    .url()
    .transform(val => {
      return new URL(val)
    }),
)

export const imagesJSONSchema = z
  .string()
  .transform((val, ctx) => {
    try {
      return JSON.parse(val)
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'invalid json',
      })
      return z.never
    }
  })
  .pipe(imagesSchema)
  .catch([])

export type Images = z.infer<typeof imagesSchema>
