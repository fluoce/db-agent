export function validateSql(sql: string): boolean {
  const trimmed = sql.trim();

  if (!trimmed) {
    return false;
  }

  // 1. must start with SELECT (case-insensitive)
  if (!/^SELECT\s/i.test(trimmed)) {
    return false;
  }

  // 2. block stacked/multiple statements — a semicolon anywhere before
  //    the very end means there's more than one statement
  const withoutTrailingSemicolon = trimmed.replace(/;+\s*$/, '');
  if (withoutTrailingSemicolon.includes(';')) {
    return false;
  }

  // 3. block dangerous keywords anywhere in the query (catches subqueries too)
  const forbidden =
    /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|GRANT|REVOKE|CREATE|COPY|EXECUTE|MERGE|CALL|VACUUM)\b/i;
  if (forbidden.test(trimmed)) {
    return false;
  }

  // 4. block comment-based injection tricks (e.g. "SELECT 1 -- ; DROP TABLE x")
  if (/--|\/\*/.test(trimmed)) {
    return false;
  }

  return true;
}
