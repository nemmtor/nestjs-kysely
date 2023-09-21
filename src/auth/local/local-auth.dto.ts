import { ApiProperty } from '@nestjs/swagger';

export class LocalAuthDto {
  userId: string;
}

export class LocalAuthRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
