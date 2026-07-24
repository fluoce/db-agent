export enum DatabaseType {
  POSTGRES = 'POSTGRES',
  MONGODB = 'MONGODB',
  MSSQL = 'MSSQL',
}

export type DatabaseSchemaType = {
  connectionId: string;
  database: {
    engine: 'postgresql';
    full_version: string;
    version: number;
    name: string;
    schema: string;
  };
  enums: { name: string; values: string[] }[] | [];
  tables:
    | {
        name: string;
        description: string | null;
        primaryKey: string[];
        columns: Array<
          | { name: string; type: string; isNullable: boolean }
          | {
              name: string;
              type: 'enum';
              enumName: string;
              enumValues: string[];
              isNullable: boolean;
            }
        >;
        indexes: { name: string; columns: string[]; unique: boolean }[];
        relations: Array<{
          type: 'one-to-one' | 'many-to-one';
          column: string;
          references: {
            table: string;
            column: string;
          };
        }>;
      }[]
    | [];
};
