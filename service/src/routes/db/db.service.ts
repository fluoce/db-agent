import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseFactory } from 'src/module/database/database.factory';
import { ResType } from '../../types/res.types';
import { DbConnectDto } from './types/db.types';
import { DatabaseCoreService } from 'src/core/database-core/database-core.service';
import { dbResMessage } from './messages/db-res.message';
import { DatabaseType } from 'src/module/database/types/database.types';
import type { StorageService } from 'src/module/storage/types/storage.interface';
import { activeStorageProvider } from 'src/config/storage.config';
import { IdService } from 'src/lib/id/id.service';
import { Database } from '@prisma/client';

@Injectable()
export class DbService {
  constructor(
    private readonly databaseFactory: DatabaseFactory,
    private readonly dbCore: DatabaseCoreService,
    @Inject(activeStorageProvider)
    private readonly storage: StorageService,
    private readonly id: IdService,
  ) {}

  async test({
    host,
    port,
    database,
    password,
    type,
    user,
  }: DbConnectDto): Promise<ResType> {
    const adapter = this.databaseFactory.getAdapter(type);

    const { success, message } = await adapter.test({
      host,
      port,
      user,
      password,
      database,
      type,
    });

    return {
      message,
      success,
    };
  }

  async save({
    connectionDto,
    userId,
  }: {
    connectionDto: DbConnectDto;
    userId: string;
  }): Promise<ResType> {
    const { success, message } = await this.test(connectionDto);

    if (!success) {
      throw new BadRequestException(dbResMessage.dbSaveTestFailed(message!));
    }

    const id = this.id.databaseId({
      type: connectionDto.type,
    });

    const objectKey = `${id}.schema.json`;

    const dbAdapter = this.databaseFactory.getAdapter(
      connectionDto.type as DatabaseType,
    );

    const schemaResult = await dbAdapter.storeSchema({
      connectionDto: {
        host: connectionDto.host,
        port: connectionDto.port,
        user: connectionDto.user,
        password: connectionDto.password,
        database: connectionDto.database,
        type: connectionDto.type as DatabaseType,
      },
      connectionId: id,
    });

    if (!schemaResult.success || !schemaResult.schema) {
      throw new BadRequestException(schemaResult?.message);
    }

    const storageFile = await this.storage.putObject({
      key: objectKey,
      buffer: Buffer.from(
        JSON.stringify(schemaResult.schema, null, 2),
        'utf-8',
      ),
      contentType: 'application/json',
    });

    if (!storageFile) {
      throw new InternalServerErrorException(
        dbResMessage.dbSchemaFailedToStore,
      );
    }

    const savedDatabase = await this.dbCore.create({
      connectionDto,
      userId,
      objectKey,
      id,
    });

    if (!savedDatabase) {
      this.storage.deleteObject({
        key: objectKey,
      });
      throw new BadRequestException(dbResMessage.dbSaveFailed);
    }

    return {
      database: savedDatabase,
      message: dbResMessage.dbSaveSuccess,
    };
  }

  async delete({
    database,
    userId,
  }: {
    database: Database;
    userId: string;
  }): Promise<ResType> {
    const deletedDatabase = await this.dbCore.delete({
      databaseId: database.id,
      userId,
    });

    if (!deletedDatabase) {
      throw new BadRequestException(dbResMessage.dbDeleteFailed);
    }

    await this.storage.deleteObject({
      key: database.objectKey,
    });

    return {
      database: null,
      message: dbResMessage.dbDeleteSuccess,
    };
  }
}
