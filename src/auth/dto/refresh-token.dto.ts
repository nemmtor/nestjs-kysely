export class RefreshTokenDto {
  userId: string;
  tokenFamilyId: string;
}

export class CreateRefreshTokenDto {
  userId: string;
  tokenFamilyId?: string;
}
