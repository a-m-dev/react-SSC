const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { readdir, unlink, writeFile } = require("fs/promises");
const startOfYear = require("date-fns/startOfYear");
const credentials = require("../credentials");

const NOTES_PATH = "./notes";
const pool = new Pool(credentials);

const now = new Date();
const startOfYear = startOfYear(now);

function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const dropTableStatement = "DROP TABLE IF EXISTS test;";
const createTableStatement = `CREATE TABLE test (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);`;
const insertRecordStatement = `INSERT INTO test(title, body, created_at, updated_at)
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;

const seedData = [
  ["rec #01", "This is record #01", randomDateBetween(startOfYear, now)],
  ["rec #02", "This is record #02", randomDateBetween(startOfYear, now)],
  ["rec #03", "This is record #03", randomDateBetween(startOfYear, now)],
  ["rec #04", "This is record #04", randomDateBetween(startOfYear, now)],
];

async function seed() {
  await pool.query(dropTableStatement);
  await pool.query(createTableStatement);
  const res = await Promise.all(
    seedData.map((row) => pool.query(insertRecordStatement, row))
  );

  const oldNotes = await readdir(path.resolve(NOTES_PATH));
  await Promise.all(
    oldNotes
      .filter((f) => f.endsWith(".md"))
      .map((f) => unlink.resolve(NOTES_PATH, f))
  );

  await Promise.all(
    res.map(({ rows }) => {
      const id = rows[0].id;
      const content = rows[0].body;
      const data = new Uint8Array(Buffer.from(content));
      return writeFile(path.resolve(NOTES_PATH, `${id}.md`), data, (err) => {
        if (err) {
          throw err;
        }
      });
    })
  );
}

seed();
