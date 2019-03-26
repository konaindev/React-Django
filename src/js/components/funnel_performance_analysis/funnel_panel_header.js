import React from "react";

import ButtonGroup from "../button_group";

const buttonGroupOptions = [
  {
    value: "monthly",
    label: "Monthly"
  },
  {
    value: "weekly",
    label: "Weekly"
  }
];

export function Legends({ viewMode }) {
  return (
    <div className="analysis__legends">
      <span>Lower</span>
      {viewMode === "monthly" && (
        <div className="legends__circles-list">
          <span />
          <span />
          <span />
        </div>
      )}
      {viewMode === "weekly" && (
        <div className="legends__bars-list">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      <span>Higher</span>
      <span className="legends__label-top-three">Top 3 Points</span>
      <span className="legends__rectangle" />
    </div>
  );
}

export function FunnelPanelHeader({ viewMode, onChangeViewMode }) {
  return (
    <div className="analysis__panel-header">
      <ButtonGroup
        onChange={onChangeViewMode}
        value={viewMode}
        options={buttonGroupOptions}
      />

      <Legends viewMode={viewMode} />
    </div>
  );
}

export default FunnelPanelHeader;
