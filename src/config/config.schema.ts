import { z } from 'nestjs-zod/z';

const portSchema = z.preprocess(
  (v) => Number.parseInt(z.string().parse(v), 10),
  z.number().positive(),
);

export const configSchema = z
  .object({
    ACCESS_TOKEN_SECRET: z.string(),
    ADMIN_TOKEN: z.string(),
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: portSchema,
    DB_USER: z.string(),
    NODE_ENV: z.union([z.literal('local'), z.literal('test'), z.literal('ci')]),
    PORT: portSchema,
    REFRESH_TOKEN_SECRET: z.string(),
    SENTRY_DSN: z.string(),
  })
  .transform((environment) => ({
    application: {
      accessTokenSecret: environment.ACCESS_TOKEN_SECRET,
      adminToken: environment.ADMIN_TOKEN,
      environment: environment.NODE_ENV,
      port: environment.PORT,
      refreshTokenSecret: environment.REFRESH_TOKEN_SECRET,
    },
    database: {
      host: environment.DB_HOST,
      name: environment.DB_NAME,
      password: environment.DB_PASSWORD,
      port: environment.DB_PORT,
      user: environment.DB_USER,
    },
    sentry: {
      dsn: environment.SENTRY_DSN,
    },
  }));
