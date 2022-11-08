import React from "react";
import { fetch } from "react-fetch";

import { CreateEmployee as CreateEmployeeClient } from "./CreateEmployee.client";

export const CreateEmployee = ({ shouldShow }) => {
  if (!shouldShow) return null;

  const managers = fetch(`http://localhost:8000/managers/`)
    .json()
    .map((x) => ({
      manager: x.manager,
      ninjas: x.ninjas.length,
    }));

  return (
    <CreateEmployeeClient managers={managers}>
      Hi from server!
    </CreateEmployeeClient>
  );
};
