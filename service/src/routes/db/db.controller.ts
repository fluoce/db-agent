import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
  async test(@Body() dbConnectDto: DbConnectDto) {
    return await this.dbService.test(dbConnectDto);
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

  @DbPublic()
  @Get()
  async getDb(@User() user: UserPayload) {
    return await this.dbService.getDbsByUserId({ userId: user.sub });
  }
}
