import { z } from 'zod';

export const configSchema = z
  .object({
    PORT: z.preprocess(
      (v) => parseInt(z.string().parse(v), 10),
      z.number().positive(),
    ),
  })
  .transform((env) => ({
    port: env.PORT,
  }));
