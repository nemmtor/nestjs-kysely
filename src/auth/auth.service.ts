import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user';

import { AccessTokenDto, RegisterDto, RefreshTokenDto } from './dto';
import { RefreshTokenRepository, TokenFamilyRepository } from './repository';
import {
  ACCESS_TOKEN_JWT_SERVICE,
  REFRESH_TOKEN_JWT_SERVICE,
} from './strategy';
import { CreateRefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ACCESS_TOKEN_JWT_SERVICE)
    private readonly accessTokenJwtService: JwtService,
    @Inject(REFRESH_TOKEN_JWT_SERVICE)
    private readonly refreshTokenJwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenFamilyRepository: TokenFamilyRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await hash(registerDto.password, 10);

    return this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
    });
  }

  private async createRefreshToken(refreshTokenDto: CreateRefreshTokenDto) {
    let tokenFamilyIdToAssign = refreshTokenDto.tokenFamilyId;

    if (!tokenFamilyIdToAssign) {
      const tokenFamily = await this.tokenFamilyRepository.create(
        refreshTokenDto.userId,
      );

      if (!tokenFamily) {
        throw new InternalServerErrorException('Expected token family');
      }

      tokenFamilyIdToAssign = tokenFamily.id;
    }

    const refreshToken = this.refreshTokenJwtService.sign({
      userId: refreshTokenDto.userId,
      tokenFamilyId: tokenFamilyIdToAssign,
    });

    await this.refreshTokenRepository.create(
      refreshToken,
      tokenFamilyIdToAssign,
    );

    return refreshToken;
  }

  private createAccessToken(accessTokenDto: AccessTokenDto) {
    return this.accessTokenJwtService.sign({
      userId: accessTokenDto.userId,
    });
  }

  async generatePairOfTokens(createRefreshTokenDto: CreateRefreshTokenDto) {
    const refreshToken = await this.createRefreshToken(createRefreshTokenDto);
    const accessToken = this.createAccessToken(createRefreshTokenDto);

    return {
      refreshToken,
      accessToken,
    };
  }

  async isRefreshTokenCompromised(
    refreshTokenDto: RefreshTokenDto,
    refreshToken: string,
  ) {
    const maybeLastTokenFromDatabase =
      await this.refreshTokenRepository.findLastByTokenFamilyId(
        refreshTokenDto.tokenFamilyId,
      );

    if (!maybeLastTokenFromDatabase) {
      throw new UnauthorizedException();
    }

    const isCompromised = maybeLastTokenFromDatabase.token !== refreshToken;

    if (isCompromised) {
      await this.tokenFamilyRepository.removeById(
        refreshTokenDto.tokenFamilyId,
      );
    }

    return isCompromised;
  }
}
