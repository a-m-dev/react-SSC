export const tableName = "employees";
export const getAllEmployees = `
  SELECT * FROM ${tableName} ORDER BY name ASC;
`;
