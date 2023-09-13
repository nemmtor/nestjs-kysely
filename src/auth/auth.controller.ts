import { Body, Controller, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

import { ApiValidationFailedResponse } from 'src/decorators';

import { AuthService } from './auth.service';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Registered successfully',
    type: RegisterResponseDto,
  })
  @ApiValidationFailedResponse()
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ZodSerializerDto(RegisterResponseDto)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
