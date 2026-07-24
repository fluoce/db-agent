export const databaseConfig = () => ({
  postgresUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
});
