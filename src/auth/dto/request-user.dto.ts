import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const RequestUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export class RequestUserDto extends createZodDto(RequestUserSchema) {}
