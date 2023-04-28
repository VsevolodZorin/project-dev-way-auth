import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtRefreshToken = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // todo
    // const refreshToken = request.refreshToken;
    const refreshToken = request?.cookies['refreshToken'];

    if (!refreshToken) {
      return null;
    }
    return refreshToken;
  },
);
