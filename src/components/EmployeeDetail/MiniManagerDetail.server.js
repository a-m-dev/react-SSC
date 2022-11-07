import React from "react";

export const MiniManagerDetail = ({ managerData }) => {
  return (
    <div className="mini-manager-chip">
      <div className="manager-wrapper">
        <img src={managerData.image_portrait_url} />
      </div>
      <span>
        {managerData.name} <i>({managerData.email})</i>
      </span>
    </div>
  );
};
