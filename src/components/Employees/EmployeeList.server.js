import React from "react";

import { fetch } from "react-fetch";
import { db } from "../../utils/db.server";
import { getAllEmployees } from "../../queries/employees";

export function EmployeeList() {
  const employees = db.query(getAllEmployees).rows;

  return employees.length > 0 ? (
    <ul>
      {employees.map((emp) => (
        <li key={emp.id}>{emp.name}</li>
      ))}
    </ul>
  ) : (
    <div>No Employees!</div>
  );
}
