import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const pairOfTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class PairOfTokensDto extends createZodDto(pairOfTokensSchema) {}
