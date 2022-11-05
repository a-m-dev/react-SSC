const path = require("path");
const { Pool } = require("pg");
const startOfYear = require("date-fns/startOfYear");
const credentials = require("../credentials");

const pool = new Pool(credentials);
const now = new Date();
const startYear = startOfYear(now);

const empJson = require("../data/employees.json");

const seedEmployees = async () => {
  const keys = empJson.map((x) => Object.keys(x));
  // console.log({ keys });
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
  );
  console.log({ tables: tables.rows });
};

seedEmployees();
