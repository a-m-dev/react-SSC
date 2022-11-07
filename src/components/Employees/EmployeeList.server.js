import React from "react";

import { fetch } from "react-fetch";
import { db } from "../../utils/db.server";
import { getAllEmployees } from "../../queries/employees";
import { EmployeeCard } from "./EmployeeCard.client";

export function EmployeeList() {
  const employees = db.query(getAllEmployees).rows;

  // console.log(employees[0]);

  return employees.length > 0 ? (
    <div className="container employees-list">
      {employees.map(({ created_at, updated_at, ...rest }) => (
        <React.Fragment key={rest.id}>
          <EmployeeCard employee={rest} />
        </React.Fragment>
      ))}
    </div>
  ) : (
    <div>No Employees!</div>
  );
}
