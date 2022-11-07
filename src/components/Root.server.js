import React, { Suspense } from "react";
import Dumb from "./Dumb.client";
import { EmployeeList } from "./Employees/EmployeeList.server";
import { EmployeeDetail } from "./EmployeeDetail/EmployeeDetail.server";

export default function App({ shouldChange, selectedEmployee }) {
  return (
    <Suspense fallback={"loading..."}>
      <>
        <h1>Wall of Fame!</h1>
        <Dumb />
        {shouldChange && "🔥"}
        <hr />
        <EmployeeList />
        <EmployeeDetail selectedEmployee={selectedEmployee} />
      </>
    </Suspense>
  );
}
