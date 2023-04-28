import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  refreshToken: string;
}
