import Collapsible from "./index";
import React from "react";

const trigger = (
  <Collapsible
    trigger={
      <div>
        <Collapsible.Icon />
        Collapsible row
      </div>
    }
  >
    <div>Content</div>
    <div>Row 1</div>
    <div>Row 2</div>
    <div>Row 3</div>
    <div>Row 4</div>
    <div>Row 5</div>
    <div>Row 6</div>
    <div>Row 7</div>
    <div>Row 8</div>
  </Collapsible>
);

const children = (
  <div>
    <div>Content</div>
    <div>Row 1</div>
    <div>Row 2</div>
    <div>Row 3</div>
    <div>Row 4</div>
    <div>Row 5</div>
    <div>Row 6</div>
    <div>Row 7</div>
    <div>Row 8</div>
  </div>
);

export const props = { trigger, children };
