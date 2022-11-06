import React, { Suspense } from "react";
import Dumb from "./Dumb.client";
import { EmployeeList } from "./Employees/EmployeeList.server";

export default function App({ shouldChange }) {
  return (
    <Suspense fallback={"loading..."}>
      <div>
        <h1>Wall of Fame!</h1>
        <Dumb />
        {shouldChange && "🔥"}
        <hr />
        <EmployeeList />
      </div>
    </Suspense>
  );
}
