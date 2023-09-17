import { z } from 'nestjs-zod/z';

const portSchema = z.preprocess(
  (v) => Number.parseInt(z.string().parse(v), 10),
  z.number().positive(),
);

export const configSchema = z
  .object({
    NODE_ENV: z.union([z.literal('local'), z.literal('test'), z.literal('ci')]),
    PORT: portSchema,
    ADMIN_TOKEN: z.string(),
    JWT_SECRET: z.string(),
    DB_HOST: z.string(),
    DB_PORT: portSchema,
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    SENTRY_DSN: z.string(),
  })
  .transform((environment) => ({
    application: {
      environment: environment.NODE_ENV,
      port: environment.PORT,
      adminToken: environment.ADMIN_TOKEN,
      jwtSecret: environment.JWT_SECRET,
    },
    database: {
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      user: environment.DB_USER,
      password: environment.DB_PASSWORD,
      name: environment.DB_NAME,
    },
    sentry: {
      dsn: environment.SENTRY_DSN,
    },
  }));
