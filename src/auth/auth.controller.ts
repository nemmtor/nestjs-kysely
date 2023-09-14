import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';
import { JwtService } from '@nestjs/jwt';

import { ApiValidationFailedResponse, User } from 'src/decorators';

import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  RequestUserDto,
} from './dto';
import { JwtAuth, LocalAuth } from './strategies';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

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

  @ApiResponse({
    status: 201,
    description: 'Logged in successfully',
    type: LoginResponseDto,
  })
  @LocalAuth()
  @ZodSerializerDto(LoginResponseDto)
  @Post('login')
  login(@User() user: RequestUserDto) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }

  // TODO: tests
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: RequestUserDto,
  })
  @JwtAuth()
  @ZodSerializerDto(RequestUserDto)
  @Get('me')
  me(@User() user: RequestUserDto) {
    console.log('user:', user);
    return user;
  }
}
