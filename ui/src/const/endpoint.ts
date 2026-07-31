const dbBaseEndpoint = "/db";

export const dbEndpoint = {
  base: dbBaseEndpoint,
  test: `${dbBaseEndpoint}/test`,
  save: `${dbBaseEndpoint}/save`,
  byId: (databaseId: string) => `${dbBaseEndpoint}/${databaseId}`,
};
