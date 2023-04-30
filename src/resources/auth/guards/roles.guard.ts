import { CanActivate, Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from 'src/resources/role/types/role.enum';
import { UserEntity } from 'src/resources/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = this.reflector.get<RolesEnum>('role', context.getHandler());
    console.log('RolesGuard -> canActivate -> role:', role);

    const user = request.user as UserEntity;
    console.log('RolesGuard -> canActivate -> user:', user);
    const hasRole = () => {
      return user.role.toString() === role.toString();
    };

    return user && user.role && hasRole();
  }
}
