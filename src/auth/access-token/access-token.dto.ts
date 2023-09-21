import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const accessTokenSchema = z.object({
  userId: z.string().uuid(),
});

export class AccessTokenDto extends createZodDto(accessTokenSchema) {}
