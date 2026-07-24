import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { DatabaseCoreService } from 'src/core/database-core/database-core.service';
import { IS_DB_PUBLIC_KEY } from 'src/decorator/db.decorator';

@Injectable()
export class DbGuard implements CanActivate {
  constructor(
    private readonly dbCore: DatabaseCoreService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isDbPublic = this.reflector.getAllAndOverride<boolean>(
      IS_DB_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isDbPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    const user = (req as any).user;

    const databaseId =
      req.params?.databaseId || req.body?.databaseId || req.query?.databaseId;

    if (!user) {
      throw new ForbiddenException(
        'User missing for database access validation.',
      );
    }
    if (!databaseId) {
      throw new ForbiddenException(
        'databaseId missing for database access validation.',
      );
    }

    const userId = user.sub ?? user.id;

    const database = await this.dbCore.getWithUserId({
      databaseId,
      userId,
    });

    if (!database) {
      throw new ForbiddenException('Database not found or access denied.');
    }

    (req as any).db = database;

    return true;
  }
}
