import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.password().min(8),
});

export class RegisterDto extends createZodDto(registerSchema) {}

const registerResponseSchema = z.object({
  id: z.string().uuid(),
  updatedAt: z.date(),
  createdAt: z.date(),
  email: z.string().email(),
});

export class RegisterResponseDto extends createZodDto(registerResponseSchema) {}
