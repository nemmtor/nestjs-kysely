import { z } from 'nestjs-zod/z';

import { configSchema } from './config.schema';

export type Config = z.infer<typeof configSchema>;
