import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DatabaseType } from 'src/module/database/types/database.types';

export class DbConnectDto {
  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsNumber()
  @IsNotEmpty()
  port!: number;

  @IsString()
  @IsNotEmpty()
  user!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  database!: string;

  @IsEnum(DatabaseType)
  @IsNotEmpty()
  type!: DatabaseType;
}
