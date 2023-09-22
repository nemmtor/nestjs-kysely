import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UserService } from 'src/user';

import { RegisterDto } from './dto';
import {
  RefreshTokenRepository,
  CreateRefreshTokenDto,
  REFRESH_TOKEN_SERVICE,
  TokenFamilyRepository,
} from './refresh-token';
import { ACCESS_TOKEN_SERVICE, AccessTokenDto } from './access-token';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: JwtService,
    @Inject(REFRESH_TOKEN_SERVICE)
    private readonly refreshTokenService: JwtService,
    private readonly userService: UserService,
    private readonly tokenFamilyRepository: TokenFamilyRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  removeExpiredTokenFamilies() {
    this.logger.log('Removing expired family trees');
    this.tokenFamilyRepository.removeExpired();
  }

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

    const refreshToken = this.refreshTokenService.sign({
      tokenFamilyId: tokenFamilyIdToAssign,
      userId: refreshTokenDto.userId,
    });

    await this.refreshTokenRepository.create(
      refreshToken,
      tokenFamilyIdToAssign,
    );

    return refreshToken;
  }

  private createAccessToken(accessTokenDto: AccessTokenDto) {
    return this.accessTokenService.sign({
      userId: accessTokenDto.userId,
    });
  }

  async generatePairOfTokens(createRefreshTokenDto: CreateRefreshTokenDto) {
    const refreshToken = await this.createRefreshToken(createRefreshTokenDto);
    const accessToken = this.createAccessToken(createRefreshTokenDto);

    return {
      accessToken,
      refreshToken,
    };
  }
}
