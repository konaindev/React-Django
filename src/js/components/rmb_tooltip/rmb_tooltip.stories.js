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
  padding: "6rem"
};

const rcTooltipExample = (
  <div style={containerStyle}>
    <div style={rowStyle}>
      <Tooltip placement="left" overlay={text}>
        <a href="#" style={styles}>
          Left
        </a>
      </Tooltip>
      <Tooltip placement="top" overlay={text}>
        <a href="#" style={styles}>
          Top
        </a>
      </Tooltip>
      <Tooltip placement="bottom" overlay={text}>
        <a href="#" style={styles}>
          Bottom
        </a>
      </Tooltip>
      <Tooltip placement="right" overlay={text}>
        <a href="#" style={styles}>
          Right
        </a>
      </Tooltip>
    </div>
    <div style={rowStyle}>
      <Tooltip placement="leftTop" overlay={text}>
        <a href="#" style={styles}>
          Left Top
        </a>
      </Tooltip>
      <Tooltip placement="leftBottom" overlay={text}>
        <a href="#" style={styles}>
          Left Bottom
        </a>
      </Tooltip>
      <Tooltip placement="rightTop" overlay={text}>
        <a href="#" style={styles}>
          Right Top
        </a>
      </Tooltip>
      <Tooltip placement="rightBottom" overlay={text}>
        <a href="#" style={styles}>
          Right Bottom
        </a>
      </Tooltip>
    </div>
    <div style={rowStyle}>
      <Tooltip placement="topLeft" overlay={text}>
        <a href="#" style={styles}>
          Top Left
        </a>
      </Tooltip>
      <Tooltip placement="topRight" overlay={text}>
        <a href="#" style={styles}>
          Top Right
        </a>
      </Tooltip>
      <Tooltip placement="bottomLeft" overlay={text}>
        <a href="#" style={styles}>
          Bottom Left
        </a>
      </Tooltip>
      <Tooltip placement="bottomRight" overlay={text}>
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
      <Container>{rcTooltipExample}</Container>
    </div>
  ))
  .add("text", () => (
    <div
      style={{
        padding: "2rem",
        width: "50vw",
        height: "50vh",
        background: "#f6f6f6",
        textAlign: "center"
      }}
    >
      <Tooltip placement="bottom" text="Tooltip Text">
        <span>Tooltip</span>
      </Tooltip>
    </div>
  ))
  .add("highlight", () => (
    <div
      style={{
        padding: "2rem",
        width: "50vw",
        height: "50vh",
        textAlign: "center"
      }}
    >
      <Tooltip placement="bottom" theme="highlight" text="Tooltip Text">
        <span>Tooltip</span>
      </Tooltip>
    </div>
  ))
  .add("dark", () => (
    <div
      style={{
        padding: "2rem",
        width: "50vw",
        height: "50vh",
        background: "#f6f6f6",
        textAlign: "center"
      }}
    >
      <Tooltip
        placement="bottom"
        theme="dark"
        text="Tooltip Text"
      >
        <span>Tooltip</span>
      </Tooltip>
    </div>
  ))
  .add("text with link", () => (
    <div
      style={{
        padding: "2rem",
        width: "75vw",
        height: "50vh",
        background: "#f6f6f6",
        textAlign: "center"
      }}
    >
      <Tooltip
        placement="bottom"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur."
        link="/"
      >
        <span>Tooltip</span>
      </Tooltip>
    </div>
  ));
