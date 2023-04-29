import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { backendMessage } from 'src/shared/backend.messages';
import { regex } from 'src/utils/regex';

export class CreateUserDto {
  @ApiProperty({
    description: 'user name',
    example: 'example@example.com',
    default: 'testUser',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email address of the User',
    example: 'example@example.com',
    default: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Password@123',
    default: 'Password@123',
  })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(regex.PASSWORD_RULE, {
    message: backendMessage.validation.PASSWORD_RULE_MESSAGE,
  })
  password: string;
}
