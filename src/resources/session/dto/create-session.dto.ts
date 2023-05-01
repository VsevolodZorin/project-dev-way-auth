import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    description: 'UserId',
    example: 1,
    default: 1,
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Jwt refresh token',
    example: 'jwt token',
    default: 'set jwt token here',
  })
  @IsNotEmpty()
  refreshToken: string;
}
