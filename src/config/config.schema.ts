import { z } from 'nestjs-zod/z';

const portSchema = z.preprocess(
  (v) => parseInt(z.string().parse(v), 10),
  z.number().positive(),
);

export const configSchema = z
  .object({
    PORT: portSchema,
    DB_HOST: z.string(),
    DB_PORT: portSchema,
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
  })
  .transform((env) => ({
    port: env.PORT,
    database: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      name: env.DB_NAME,
    },
  }));
