import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findUserByIdParametersSchema = z.object({
  userId: z.string().uuid(),
});

export class FindUserByIdRequestParameters extends createZodDto(
  findUserByIdParametersSchema,
) {}

const findUserByIdResponseSchema = z.object({
  createdAt: z.date(),
  deletedAt: z.date().optional(),
  email: z.string().email(),
  id: z.string().uuid(),
  updatedAt: z.date(),
});

export class FindUserByIdResponseDto extends createZodDto(
  findUserByIdResponseSchema,
) {}
