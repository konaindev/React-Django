import React from "react";
import IconBase from "./icon_base";

const ListView = props => (
  <IconBase viewBox="0 0 20 20" {...props}>
    <mask id="a" fill="#fff">
      <rect y="1" width="20" height="4" rx="1" />
    </mask>
    <rect
      y="1"
      width="20"
      height="4"
      rx="1"
      stroke="currentColor"
      strokeWidth="2.4"
      mask="url(#a)"
    />
    <mask id="b" fill="#fff">
      <rect y="8" width="20" height="4" rx="1" />
    </mask>
    <rect
      y="8"
      width="20"
      height="4"
      rx="1"
      stroke="currentColor"
      strokeWidth="2.4"
      mask="url(#b)"
    />
    <mask id="c" fill="#fff">
      <rect y="15" width="20" height="4" rx="1" />
    </mask>
    <rect
      y="15"
      width="20"
      height="4"
      rx="1"
      stroke="currentColor"
      strokeWidth="2.4"
      mask="url(#c)"
    />
  </IconBase>
);

export default ListView;
