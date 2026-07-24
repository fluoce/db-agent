import { DatabaseType } from '@prisma/client';

export interface IdInterface {
  databaseId({ type }: { type: DatabaseType }): string;
}
