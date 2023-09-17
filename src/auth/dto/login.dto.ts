import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export class LoginResponseDto extends createZodDto(loginResponseSchema) {}
