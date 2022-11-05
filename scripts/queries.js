const getAllTables = `
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema='public';
`;

const tableName = "employees";
const dropEmployeesTableIfExists = `DROP TABLE IF EXISTS ${tableName};`;
const createEmployeesTable = `CREATE TABLE ${tableName} (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(240) NOT NULL,
  email VARCHAR(240) NOT NULL,
  phone_number VARCHAR(24),
  office VARCHAR(20) CHECK (office IN ('Lund', 'Helsingborg', 'Stockholm', 'Borlänge', 'Ljubljana')),
  manager VARCHAR(240),
  org_unit VARCHAR(50) NOT NULL
  main_text TEXT,
  github VARCHAR(240),
  twitter VARCHAR(240),
  stackoverflow VARCHAR(240),
  linkedin VARCHAR(240),
  image_portrait_url VARCHAR(240),
  image_wall_of_leet_url VARCHAR(240),
  highlighted BOOLEAN DEFAULT True,
  published BOOLEAN DEFAULT True,
);`;
const insertIntoEmployeesTable = `INSERT INTO 
  ${tableName}(name, email, phone_number, office, manager, org_unit, main_text, github, twitter, stackoverflow, linkedin, image_portrait_url, image_wall_of_leet_url, highlighted, published) 
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  RETURNING *
`;
const getRecordsCount = `
  SELECT COUNT(*) FROM ${tableName};
`;

module.exports = {
  getAllTables,
  tableName,
  dropEmployeesTableIfExists,
  createEmployeesTable,
  insertIntoEmployeesTable,
  getRecordsCount,
};
