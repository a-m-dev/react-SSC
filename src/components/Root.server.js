import React, { Suspense } from "react";
import { EmployeeList } from "./Employees/EmployeeList.server";
import { EmployeeDetail } from "./EmployeeDetail/EmployeeDetail.server";
import { Actions } from "./Actions/Actions.server";
import { CreateEmployee } from "./CreateEmployee/CreateEmployee.server";

export default function App({
  selectedEmployee,
  shouldShowCreateEmployeeDialog,
}) {
  return (
    <Suspense fallback={"loading..."}>
      <>
        <h1 className="app-name">1337 Wall of Fame!</h1>
        <Actions />

        <EmployeeList />
        <EmployeeDetail selectedEmployee={selectedEmployee} />
        <CreateEmployee shouldShow={shouldShowCreateEmployeeDialog} />
      </>
    </Suspense>
  );
}
