import React from "react";
import { fetch } from "react-fetch";

import { Actions as ClientActions } from "./Actions.client";

export const Actions = () => {
  const empCount = fetch(`http://localhost:8000/getEmployeesCount`).json();

  return <ClientActions empCount={empCount.count} />;
};
