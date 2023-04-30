import { SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/resources/auth/guards/roles.guard';
import { RolesEnum } from '../types/role.enum';

export const Role = (role: RolesEnum) => (proto, propName, descriptor) => {
  UseGuards(RolesGuard)(proto, propName, descriptor);
  SetMetadata('role', role)(proto, propName, descriptor);
};
