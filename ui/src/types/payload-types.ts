export type DatabaseDtoType = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  type: "POSTGRES" | "MONGODB" | "MSSQL";
};
