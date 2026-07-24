import { Injectable } from '@nestjs/common';
import Knex from 'knex';
import { DatabaseSchemaType } from '../types/database.types';

@Injectable()
export class BuildSchema {
  constructor() {}

  async getDatabaseInfo({
    pg,
  }: {
    pg: Knex.Knex;
  }): Promise<DatabaseSchemaType['database'] | null> {
    const result = await pg.raw(`
      SELECT
        version() AS full_version,
        current_setting('server_version') AS version,
        current_database() AS name,
        current_schema() AS schema
    `);

    if (!result) {
      return null;
    }

    const row = result?.rows[0];

    return {
      engine: 'postgresql',
      full_version: row.full_version,
      version: row?.version,
      name: row?.name,
      schema: row?.schema,
    };
  }

  async getDatabaseEnums({
    pg,
  }: {
    pg: Knex.Knex;
  }): Promise<DatabaseSchemaType['enums'] | null> {
    const result = await pg.raw(`
        SELECT
            t.typname AS name,
            e.enumlabel AS value
        FROM pg_type t
        JOIN pg_enum e
            ON t.oid = e.enumtypid
        JOIN pg_namespace n
            ON n.oid = t.typnamespace
        WHERE n.nspname = current_schema()
        ORDER BY t.typname, e.enumsortorder
    `);

    if (!result) {
      return null;
    }

    const enumsGroup = new Map<string, string[]>();

    for (const row of result?.rows) {
      if (!enumsGroup.has(row?.name)) {
        enumsGroup.set(row?.name, []);
      }

      enumsGroup.get(row?.name)!.push(row?.value);
    }

    const enums = Array.from(enumsGroup.entries()).map(([name, values]) => ({
      name,
      values,
    }));

    return enums;
  }

  async getDatabaseTables({
    pg,
  }: {
    pg: Knex.Knex;
  }): Promise<DatabaseSchemaType['tables'] | null> {
    const [tables, columns, primaryKeys, indexes, foreignKeys] =
      await Promise.all([
        this.fetchTablesNames(pg),
        this.fetchTablesColumns(pg),
        this.fetchTablesPrimaryKeys(pg),
        this.fetchTablesIndexes(pg),
        this.fetchTablesForeignKeys(pg),
      ]);

    const enums = await this.getDatabaseEnums({ pg });

    const enumsByName = new Map(
      (enums ?? []).map((e) => [e.name.toLowerCase(), e]),
    );

    return tables.map((t) => ({
      name: t.name,
      description: t.description,
      primaryKey: primaryKeys
        .filter((p) => p.table_name === t.name)
        .sort((a, b) => a.ordinal_position - b.ordinal_position)
        .map((p) => p.column_name),
      columns: columns
        .filter((c) => c.table_name === t.name)
        .map((c) => {
          const matchedEnum = enumsByName.get(c.udt_name.toLowerCase());
          if (matchedEnum) {
            return {
              name: c.column_name,
              type: 'enum' as const,
              enumName: matchedEnum.name,
              enumValues: matchedEnum.values,
              isNullable: c.is_nullable === 'YES',
            };
          }

          return {
            name: c.column_name,
            type: this.formatDataType(c),
            isNullable: c.is_nullable === 'YES',
          };
        }),
      indexes: this.groupTablesIndexes(indexes, t.name),
      relations: foreignKeys
        .filter((f) => f.table_name === t.name)
        .map((f) => ({
          type: f.is_unique ? 'one-to-one' : 'many-to-one',
          column: f.column_name,
          references: {
            table: f.foreign_table_name,
            column: f.foreign_column_name,
          },
        })),
    }));
  }

  private async fetchTablesNames(
    pg: Knex.Knex,
  ): Promise<{ name: string; description: string | null }[]> {
    const result = await pg.raw(`
      SELECT
        c.relname AS name,
        obj_description(c.oid, 'pg_class') AS description
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = current_schema() AND c.relkind = 'r'
      ORDER BY c.relname
    `);
    return result.rows;
  }

  private async fetchTablesColumns(pg: Knex.Knex): Promise<
    {
      table_name: string;
      column_name: string;
      data_type: string;
      udt_name: string;
      character_maximum_length: number | null;
      numeric_precision: number | null;
      numeric_scale: number | null;
      is_nullable: string | 'YES' | 'NO';
    }[]
  > {
    const result = await pg.raw(`
      SELECT table_name, column_name, data_type, udt_name,
        character_maximum_length, numeric_precision, numeric_scale,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = current_schema()
      ORDER BY table_name, ordinal_position
    `);
    return result.rows;
  }

  private async fetchTablesPrimaryKeys(pg: Knex.Knex): Promise<
    {
      table_name: string;
      column_name: string;
      ordinal_position: number;
    }[]
  > {
    const result = await pg.raw(`
      SELECT tc.table_name, kcu.column_name, kcu.ordinal_position
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = current_schema()
    `);
    return result.rows;
  }

  private async fetchTablesIndexes(pg: Knex.Knex): Promise<
    {
      table_name: string;
      index_name: string;
      column_name: string;
      is_unique: boolean;
    }[]
  > {
    const result = await pg.raw(`
      SELECT
        t.relname AS table_name,
        i.relname AS index_name,
        a.attname AS column_name,
        ix.indisunique AS is_unique
      FROM pg_index ix
      JOIN pg_class t ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      JOIN unnest(ix.indkey) WITH ORDINALITY AS cols(attnum, ord) ON true
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = cols.attnum
      WHERE n.nspname = current_schema() AND t.relkind = 'r'
      ORDER BY t.relname, i.relname, cols.ord
    `);
    return result.rows;
  }

  private async fetchTablesForeignKeys(pg: Knex.Knex): Promise<
    {
      table_name: string;
      column_name: string;
      foreign_table_name: string;
      foreign_column_name: string;
      is_unique: boolean;
    }[]
  > {
    const result = await pg.raw(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        EXISTS (
          SELECT 1 FROM information_schema.table_constraints tc2
          JOIN information_schema.key_column_usage kcu2
            ON tc2.constraint_name = kcu2.constraint_name
          WHERE tc2.constraint_type = 'UNIQUE'
            AND tc2.table_name = tc.table_name
            AND kcu2.column_name = kcu.column_name
        ) AS is_unique
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = current_schema()
    `);
    return result.rows;
  }

  private groupTablesIndexes(
    rows: any[],
    tableName: string,
  ): { name: string; columns: string[]; unique: boolean }[] {
    const grouped = new Map<
      string,
      { name: string; columns: string[]; unique: boolean }
    >();
    for (const row of rows) {
      if (row.table_name !== tableName) continue;
      if (!grouped.has(row.index_name)) {
        grouped.set(row.index_name, {
          name: row.index_name,
          columns: [],
          unique: row.is_unique,
        });
      }
      grouped.get(row.index_name)!.columns.push(row.column_name);
    }
    return Array.from(grouped.values());
  }

  private formatDataType(c: any): string {
    if (c.data_type === 'character varying' && c.character_maximum_length) {
      return `varchar(${c.character_maximum_length})`;
    }
    if (c.data_type === 'numeric' && c.numeric_precision) {
      return `numeric(${c.numeric_precision},${c.numeric_scale ?? 0})`;
    }
    return c.udt_name;
  }
}
