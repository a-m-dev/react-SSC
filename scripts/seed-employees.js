const { Pool } = require("pg");
const credentials = require("../credentials");
const {
  getAllTables,
  tableName,
  dropEmployeesTableIfExists,
  createEmployeesTable,
  insertIntoEmployeesTable,
  getRecordsCount,
} = require("./queries");
const empJson = require("../data/employees.json");

const pool = new Pool(credentials);

const seedEmployees = async () => {
  const qResponse = await pool.query(getAllTables);
  const tableNames = qResponse.rows.reduce((acc, curr) => {
    return [...acc, curr.table_name];
  }, []);

  if (!tableNames.includes(tableName)) {
    console.log("should create table first!");
    await pool.query(dropEmployeesTableIfExists);
    await pool.query(createEmployeesTable);
  }

  console.log("good to go");

  const qRecordsCount = await pool.query(getRecordsCount);

  if (Number(qRecordsCount.rows[0].count) === 0) {
    const seedData = empJson.map((x) => Object.values(x));
    await Promise.all(
      seedData.map((row) => pool.query(insertIntoEmployeesTable, row))
    );
  } else {
    console.log(`
  // NOTE: 
  Data is probably already seeded!
  current records count is: ${Number(qRecordsCount.rows[0].count)}
    `);
  }
};

seedEmployees();
