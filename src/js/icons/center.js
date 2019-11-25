import React from "react";

import IconBase from "./icon_base";

const IconCenter = props => (
  <IconBase viewBox="0 0 20 20" fill="none" {...props}>
    <circle cx="10" cy="10" r="4" fill="#666666" />
    <circle cx="10" cy="10" r="9" stroke="#666666" strokeWidth="2" />
  </IconBase>
);

export default IconCenter;
