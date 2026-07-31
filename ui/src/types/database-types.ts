export type DatabaseType = {
  database: {
    id: string;
    userId: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    type: string;
    objectKey: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
