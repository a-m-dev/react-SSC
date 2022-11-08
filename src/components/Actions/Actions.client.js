import React from "react";
import { useAppContext } from "../../contexts/AppContext.client";
import "./Actions.scss";

export const Actions = ({ empCount }) => {
  const { setAppState } = useAppContext();

  const handleCreateEmployee = () => {
    setAppState((prev) => ({
      ...prev,
      shouldShowCreateEmployeeDialog: true,
    }));
  };

  return (
    <div className="container">
      <div className="actions">
        <h2>Employees ({empCount}):</h2>
        <div>
          <button onClick={handleCreateEmployee}>Add One!</button>
        </div>
      </div>
    </div>
  );
};
