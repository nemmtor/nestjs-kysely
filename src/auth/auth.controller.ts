import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

import { ApiValidationFailedResponse, User } from 'src/decorators';

import { AuthService } from './auth.service';
import { PairOfTokensDto, RegisterDto, RegisterResponseDto } from './dto';
import { RefreshTokenAuth, RefreshTokenDto } from './refresh-token';
import { AccessTokenAuth, AccessTokenDto } from './access-token';
import { LocalAuth, LocalAuthDto } from './local';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
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

  @ApiCreatedResponse({
    description: 'Logged in successfully',
    type: PairOfTokensDto,
  })
  @LocalAuth()
  @ZodSerializerDto(PairOfTokensDto)
  @Post('login')
  login(@User() localAuthDto: LocalAuthDto) {
    return this.authService.generatePairOfTokens(localAuthDto);
  }

  @ApiOkResponse({
    description: 'User data',
    type: AccessTokenDto,
  })
  @AccessTokenAuth()
  @ZodSerializerDto(AccessTokenDto)
  @Get('me')
  me(@User() accessTokenDto: AccessTokenDto) {
    return accessTokenDto;
  }

  @ApiOkResponse({
    description: 'User data',
    type: PairOfTokensDto,
  })
  @RefreshTokenAuth()
  @ZodSerializerDto(PairOfTokensDto)
  @Post('refresh')
  refresh(@User() refreshTokenDto: RefreshTokenDto) {
    return this.authService.generatePairOfTokens(refreshTokenDto);
  }
}
