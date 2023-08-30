import { z } from 'nestjs-zod/z';

const portSchema = z.preprocess(
  (v) => Number.parseInt(z.string().parse(v), 10),
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
  .transform((environment) => ({
    port: environment.PORT,
    database: {
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      user: environment.DB_USER,
      password: environment.DB_PASSWORD,
      name: environment.DB_NAME,
    },
  }));
