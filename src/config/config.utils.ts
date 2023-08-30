import { configSchema } from './config.schema';

export const loadEnvironment = () => {
  return configSchema.parse(process.env);
};
