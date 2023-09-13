import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const killSwitchParametersDto = z.object({
  status: z.union([z.literal('off'), z.literal('on')]),
});

export class KillSwitchParametersDto extends createZodDto(
  killSwitchParametersDto,
) {}
