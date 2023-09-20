import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

import { ApiValidationFailedResponse, User } from 'src/decorators';

import { AuthService } from './auth.service';
import {
  AccessTokenDto,
  LocalAuthDto,
  PairOfTokensDto,
  RefreshTokenDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto';
import { AccessTokenJwtAuth, LocalAuth, RefreshTokenJwtAuth } from './strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    type: PairOfTokensDto,
  })
  @LocalAuth()
  @ZodSerializerDto(PairOfTokensDto)
  @Post('login')
  login(@User() localAuthDto: LocalAuthDto) {
    return this.authService.generatePairOfTokens(localAuthDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User data',
    type: AccessTokenDto,
  })
  @AccessTokenJwtAuth()
  @ZodSerializerDto(AccessTokenDto)
  @Get('me')
  me(@User() accessTokenDto: AccessTokenDto) {
    return accessTokenDto;
  }

  @ApiResponse({
    status: 200,
    description: 'User data',
    type: PairOfTokensDto,
  })
  @RefreshTokenJwtAuth()
  @ZodSerializerDto(PairOfTokensDto)
  @Post('refresh')
  refresh(@User() refreshTokenDto: RefreshTokenDto) {
    return this.authService.generatePairOfTokens(refreshTokenDto);
  }
}
