import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { DbConnectDto } from './types/db.types';
import { DbService } from './db.service';
import { User } from 'src/decorator/user.decorator';
import type { UserPayload } from 'src/types/user-payload.types';
import { Db, DbPublic } from 'src/decorator/db.decorator';
import type { Database } from '@prisma/client';

@Controller('db')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @DbPublic()
  @Post('test')
  async test(
    @Body() { host, port, user, password, database, type }: DbConnectDto,
  ) {
    return await this.dbService.test({
      host,
      port,
      user,
      password,
      database,
      type,
    });
  }

  @DbPublic()
  @Post('save')
  async save(@User() user: UserPayload, @Body() dbConnectDto: DbConnectDto) {
    return await this.dbService.save({
      connectionDto: dbConnectDto,
      userId: user.sub,
    });
  }

  @Delete(':databaseId')
  async delete(@User() user: UserPayload, @Db() database: Database) {
    return await this.dbService.delete({ database, userId: user?.sub });
  }
}
