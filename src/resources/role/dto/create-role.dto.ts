import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'role name',
    example: 'admin or user',
    default: 'admin',
  })
  @IsNotEmpty()
  name: string;
}
