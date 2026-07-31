export const dbResMessage = {
  dbSaveTestFailed: (error?: string) =>
    `Database save Test failed: ${error ?? 'Unknown error'}`,
  dbSaveFailed:
    'Failed to save database; it may already exist or there was an error.',
  dbSaveSuccess: 'Database connection saved successfully',
  dbDeleteFailed: 'Failed to delete database connection information',
  dbDeleteSuccess: 'Database connection information deleted successfully',
  dbSchemaFailedToStore: 'Failed to store schema file in storage',
  dbGetSuccess: 'Database retrieved successfully',
  dbGetEmpty: 'No matching database found',
};
