import { IsNotEmpty } from 'class-validator';
import { RolesEnum } from '../types/role.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  name: RolesEnum;
}
