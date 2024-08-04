import { z } from "zod";

const imagesSchema = z.array(
  z.object({
    format: z.string(),
    b64Data: z.string(),
  })
);

export const imagesJSONSchema = z
  .string()
  .transform((val, ctx) => {
    try {
      return JSON.parse(val);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalid json",
      });
      return z.never;
    }
  })
  .pipe(imagesSchema)
  .catch([]);

export type Images = z.infer<typeof imagesSchema>;
