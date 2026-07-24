import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const Db = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.db;
});

export const IS_DB_PUBLIC_KEY = 'isDbPublic';

export const DbPublic = () => SetMetadata(IS_DB_PUBLIC_KEY, true);
