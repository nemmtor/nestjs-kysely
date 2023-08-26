import { z } from 'zod';
import { configSchema } from './config.schema';

export type Config = z.infer<typeof configSchema>;
