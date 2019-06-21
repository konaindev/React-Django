import React from "react";
import IconBase from "./icon_base";

const TileView = props => (
  <IconBase viewBox="0 0 20 20" {...props}>
    <rect
      x=".6"
      y=".6"
      width="6.8"
      height="6.8"
      rx=".8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <rect
      x=".6"
      y="12.6"
      width="6.8"
      height="6.8"
      rx=".8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <rect
      x="12.6"
      y=".6"
      width="6.8"
      height="6.8"
      rx=".8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <rect
      x="12.6"
      y="12.6"
      width="6.8"
      height="6.8"
      rx=".8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
  </IconBase>
);

export default TileView;
