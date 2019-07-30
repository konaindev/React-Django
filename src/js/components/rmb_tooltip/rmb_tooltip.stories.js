import React from "react";

import { storiesOf } from "@storybook/react";

import Container from "../container";
import Tooltip from "./index";

const text = <span>Tooltip Text</span>;
const styles = {
  display: "table-cell",
  height: "60px",
  width: "80px",
  textAlign: "center",
  background: "#f6f6f6",
  verticalAlign: "middle",
  border: "5px solid white"
};

const rowStyle = {
  display: "table-row"
};

const containerStyle = {
  display: "table",
  backgroundColor: "#FFF",
  padding: "2rem"
};

const rcTooltipExample = theme => (
  <div style={containerStyle}>
    <div style={rowStyle}>
      <Tooltip theme={theme} placement="left" overlay={text}>
        <a href="#" style={styles}>
          Left
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="top" overlay={text}>
        <a href="#" style={styles}>
          Top
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="bottom" overlay={text}>
        <a href="#" style={styles}>
          Bottom
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="right" overlay={text}>
        <a href="#" style={styles}>
          Right
        </a>
      </Tooltip>
    </div>
    <div style={rowStyle}>
      <Tooltip theme={theme} placement="leftTop" overlay={text}>
        <a href="#" style={styles}>
          Left Top
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="leftBottom" overlay={text}>
        <a href="#" style={styles}>
          Left Bottom
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="rightTop" overlay={text}>
        <a href="#" style={styles}>
          Right Top
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="rightBottom" overlay={text}>
        <a href="#" style={styles}>
          Right Bottom
        </a>
      </Tooltip>
    </div>
    <div style={rowStyle}>
      <Tooltip theme={theme} placement="topLeft" overlay={text}>
        <a href="#" style={styles}>
          Top Left
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="topRight" overlay={text}>
        <a href="#" style={styles}>
          Top Right
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="bottomLeft" overlay={text}>
        <a href="#" style={styles}>
          Bottom Left
        </a>
      </Tooltip>
      <Tooltip theme={theme} placement="bottomRight" overlay={text}>
        <a href="#" style={styles}>
          Bottom Right
        </a>
      </Tooltip>
    </div>
  </div>
);

storiesOf("RMBTooltip", module)
  .add("base", () => (
    <div style={{ margin: "1rem auto" }}>
      <Container>{rcTooltipExample()}</Container>
    </div>
  ))
  .add("light", () => (
    <div style={{ margin: "1rem auto" }}>
      <Container>{rcTooltipExample("light")}</Container>
    </div>
  ));
