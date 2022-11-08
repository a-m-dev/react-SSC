import React, { useEffect, useState, useTransition } from "react";
import { useAppContext } from "../../contexts/AppContext.client";
import { useMutation } from "../../utils/useMutation";
import { navigate } from "../../utils/navigate";

import "./CreateEmployee.scss";

const officeList = [
  "Lund",
  "Helsingborg",
  "Stockholm",
  "Borlänge",
  "Ljubljana",
];

export const CreateEmployee = ({ children, managers }) => {
  const { appState, setAppState } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    text: "",
    office: "",
  });
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isNavigating, startNavigating] = useTransition();
  const [isSaving, saveEmployee] = useMutation({
    endpoint: `/employee`,
    method: "POST",
  });

  const handleCloseDialog = () => {
    setAppState((prev) => ({
      ...prev,
      shouldShowCreateEmployeeDialog: false,
    }));
  };
  const handleFromChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((x) => !x)) return;
    const requestedLocation = {
      ...appState,
      // close form
      shouldShowCreateEmployeeDialog: false,
    };
    const response = await saveEmployee(formData, requestedLocation);
    navigate({ response, startNavigating, setAppState });
  };
  const handleManagerClick = (email) => {
    setSelectedManager(email);
    setFormData((prev) => ({
      ...prev,
      manager: email,
    }));
  };

  const handleOfficeClick = (office) => {
    setSelectedOffice(office);
    setFormData((prev) => ({
      ...prev,
      office,
    }));
  };

  return (
    <div className="create-employee">
      <div className="dialog-wrapper">
        <h1>Create Employee</h1>
        <span>Here you can create employee!</span>

        <div className="scrollable">
          <div>{children}</div>

          <form className="form" onSubmit={handleFormSubmit}>
            <label for="name">Name:</label>
            <input
              id="name"
              name="name"
              autoComplete="off"
              value={formData["name"]}
              onChange={handleFromChange}
            />

            <label for="office">Select Office:</label>
            <div id="office" className="manager-wrapper">
              {officeList.map((x, i) => (
                <div
                  key={i}
                  className={[
                    "manager-item",
                    selectedOffice === x ? " manager-item--active" : "",
                  ].join(" ")}
                  onClick={() => handleOfficeClick(x)}
                >
                  <h4>{x}</h4>
                </div>
              ))}
            </div>

            <label for="manager">Select Manager:</label>
            <div id="manager" className="manager-wrapper">
              {managers.map((x, i) => {
                const [first, last] = x.manager.split("@")[0].split(".");
                return (
                  <div
                    key={i}
                    className={[
                      "manager-item",
                      selectedManager === x.manager
                        ? " manager-item--active"
                        : "",
                    ].join(" ")}
                    onClick={() => handleManagerClick(x.manager)}
                  >
                    <h4>{`${first} ${last}`}</h4>
                    <span>({x.ninjas} Ninjas!)</span>
                  </div>
                );
              })}
            </div>

            <label for="text">Add Text:</label>
            <textarea
              id="text"
              name="text"
              value={formData["text"]}
              onChange={handleFromChange}
            />

            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="actions">
          <button onClick={handleCloseDialog}>close</button>
        </div>
      </div>
    </div>
  );
};
