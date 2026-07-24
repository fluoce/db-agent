import { Injectable, Logger } from '@nestjs/common';
import { Database } from '@prisma/client';
import { funcTryCatch } from 'src/func/func-try-catch';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { DbConnectDto } from 'src/routes/db/types/db.types';

@Injectable()
export class DatabaseCoreService {
  private readonly logger = new Logger(DatabaseCoreService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create({
    connectionDto,
    objectKey,
    userId,
    id,
  }: {
    connectionDto: DbConnectDto;
    userId: string;
    objectKey: string;
    id: string;
  }) {
    return await funcTryCatch<Database, null>({
      func: () => {
        return this.prisma.database.create({
          data: {
            id,
            ...connectionDto,
            userId,
            objectKey,
          },
        });
      },
      logger: this.logger,
      action: 'database_create',
    });
  }

  async getById({ databaseId }: { databaseId: string }) {
    return await funcTryCatch<Database | null, null>({
      func: () => {
        return this.prisma.database.findUnique({
          where: {
            id: databaseId,
          },
        });
      },
      logger: this.logger,
      action: `database_getById_${databaseId}`,
    });
  }

  async getWithUserId({
    databaseId,
    userId,
  }: {
    databaseId: string;
    userId: string;
  }) {
    return await funcTryCatch<Database | null, null>({
      func: () => {
        return this.prisma.database.findUnique({
          where: {
            id: databaseId,
            userId,
          },
        });
      },
      logger: this.logger,
      action: `database_getWithUserId_${databaseId}_${userId}`,
    });
  }

  async delete({ databaseId, userId }: { databaseId: string; userId: string }) {
    return await funcTryCatch<Database, null>({
      func: () => {
        return this.prisma.database.delete({
          where: {
            id: databaseId,
            userId,
          },
        });
      },
      logger: this.logger,
      action: `database_delete_${databaseId}`,
    });
  }
}
