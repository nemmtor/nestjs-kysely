import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  userId: string;
  tokenFamilyId: string;
}

export class CreateRefreshTokenDto {
  userId: string;
  tokenFamilyId?: string;
}

export class RefreshRequestDto {
  @ApiProperty()
  refreshToken: string;
}
