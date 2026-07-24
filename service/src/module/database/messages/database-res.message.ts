export const databaseResMessage = {
  testSuccess:
    'Successfully connected to PostgreSQL and executed a test query.',
  testFailed: (error: string) =>
    `Connection failed: ${error ?? 'Unknown error'}`,
  schemaBuildedSuccess: 'Database schema retrieved and built successfully.',
  schemaBuildedFailed: (error: string) =>
    `Failed to build database schema: ${error ?? 'Unknown error'}`,
  invalidQuery: 'Invalid or potentially unsafe query detected.',
  noResultOnqueyExcution: 'No result found on query execution.',
};
