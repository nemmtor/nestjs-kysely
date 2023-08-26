import { configSchema } from './config.schema';

export const loadEnv = () => {
  return configSchema.parse(process.env);
};
