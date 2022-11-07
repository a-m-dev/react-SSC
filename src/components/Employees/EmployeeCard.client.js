import React, { useTransition } from "react";
import { useAppContext } from "../../contexts/AppContext.client";
import "./Employee.scss";

export function EmployeeCard({ employee }) {
  const { setAppState } = useAppContext();
  const [isPending, startTransition] = useTransition();

  const handleCardClick = () => {
    startTransition(() => {
      setAppState((prev) => ({
        ...prev,
        selectedEmployee: employee.id,
      }));
    });
  };

  return (
    <div className="employee-card" onClick={handleCardClick}>
      <div className="employee-card__image">
        {employee.image_portrait_url ? (
          <img src={employee.image_portrait_url} />
        ) : (
          <div className="no-image">:(</div>
        )}
      </div>
      <h5>{employee.name || "Not name!"}</h5>
    </div>
  );
}
