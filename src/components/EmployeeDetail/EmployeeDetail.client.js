import React from "react";
import { useAppContext } from "../../contexts/AppContext.client";
import "./EmployeeDetail.scss";

export const EmployeeDetail = ({
  selectedEmployee,
  employeeData,
  children,
  managerData,
}) => {
  const { setAppState } = useAppContext();

  const handleCloseDialog = () => {
    setAppState((prev) => ({
      ...prev,
      selectedEmployee: null,
    }));
  };

  return (
    <div className="employee-detail">
      <div className="dialog-wrapper">
        <div className="content">
          <div className="cover">
            <div className="bg">
              {employeeData.image_wall_of_leet_url ? (
                <img src={employeeData.image_wall_of_leet_url} />
              ) : (
                <div className="bg--empty">
                  <span>:(</span>
                </div>
              )}
            </div>

            <div className="avatar">
              {employeeData.image_portrait_url ? (
                <img src={employeeData.image_portrait_url} />
              ) : (
                <div className="avatar--empty">:(</div>
              )}
            </div>
          </div>

          <h1>{employeeData.name}</h1>
          <h3>EmployeeId: {selectedEmployee}</h3>

          <div className="social">
            <a href="">
              <i className="fa-brands fa-github" />
            </a>
            <a href="">
              <i className="fa-brands fa-twitter" />
            </a>
            <a href="">
              <i className="fa-brands fa-linkedin" />
            </a>
          </div>

          {children}

          <div
            className="text"
            dangerouslySetInnerHTML={{ __html: employeeData.main_text }}
          />
        </div>

        <div className="actions">
          <button onClick={handleCloseDialog}>close</button>
        </div>
      </div>
    </div>
  );
};
