#!/bin/bash

echo $POSTGRES_USER;
echo $POSTGRES_DB;

set -e


psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DROP TABLE IF EXISTS employees;
  CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(240) NOT NULL,
    phone_number VARCHAR(24) NOT NULL,
    manager VARCHAR(240) NOT NULL,
    main_text TEXT,
    twitter VARCHAR(240),
    linkedin VARCHAR(240),
    github VARCHAR(240),
    stackoverflow VARCHAR(240),
    image_wall_of_leet_url VARCHAR(240) NOT NULL,
    image_portrait_url VARCHAR(240) NOT NULL,
    published BOOLEAN DEFAULT True,
    highlighted BOOLEAN DEFAULT True,
    email VARCHAR(240) NOT NULL,
    office VARCHAR(20) CHECK (office IN ('Lund', 'Helsingborg', 'Stockholm', 'Borlänge', 'Ljubljana')),
    org_unit VARCHAR(50) NOT NULL
  );
EOSQL