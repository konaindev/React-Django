import React from "react";

import IconBase from "./icon_base";

export function CloseSvgPath() {
  return (
    <>
      <path
        d="M1.43532 1.92201L11.3649 12.0613"
        stroke="#5cf6dd"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M11.4774 1.90854L1.83659 12.0504"
        stroke="#5cf6dd"
        stroke-width="2"
        stroke-linecap="round"
      />
    </>
  );
}

export default function Close(props) {
  return (
    <IconBase viewBox="0 0 13 14" fill="none" {...props}>
      <CloseSvgPath />
    </IconBase>
  );
}
