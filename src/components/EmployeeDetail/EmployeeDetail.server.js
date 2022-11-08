import React from "react";
import { fetch } from "react-fetch";
import { EmployeeDetail as ClientEmployeeDetail } from "./EmployeeDetail.client";
import { MiniManagerDetail } from "./MiniManagerDetail.server";

export const EmployeeDetail = ({ selectedEmployee }) => {
  if (!selectedEmployee) return null;

  const employeeData = fetch(
    `http://localhost:8000/employee/${selectedEmployee}`
  ).json();

  const managerData = fetch(
    `http://localhost:8000/managerByEmail/${employeeData.manager}`
  ).json();

  return (
    <ClientEmployeeDetail
      employeeData={employeeData}
      selectedEmployee={selectedEmployee}
      // TODO:
      // instead of passing manager email only
      // fetch manager data and show avatar
      // manager={employeeData.manager}
      // 👇
      managerData={managerData}
    >
      <div className="server-class">
        <MiniManagerDetail managerData={managerData} />
        <h5>Some Important data from server component!</h5>
      </div>
    </ClientEmployeeDetail>
  );
};
