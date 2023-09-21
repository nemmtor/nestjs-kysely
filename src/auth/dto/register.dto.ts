import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.password().min(8),
});

export class RegisterDto extends createZodDto(registerSchema) {}

const registerResponseSchema = z.object({
  createdAt: z.date(),
  email: z.string().email(),
  id: z.string().uuid(),
  updatedAt: z.date(),
});

export class RegisterResponseDto extends createZodDto(registerResponseSchema) {}
