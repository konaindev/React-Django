import React from "react";
import renderer from "react-test-renderer";

import Collapsible from "./index";
import { props } from "./props";

describe("Collapsible", () => {
  function createNodeMock(element) {
    if (element.type === "div") {
      return { scrollHeight: 150 };
    }
    return null;
  }

  it("render default", () => {
    const options = { createNodeMock };
    const tree = renderer
      .create(<Collapsible {...props} trigger="Collapsible row" />, options)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render open", () => {
    const options = { createNodeMock };
    const tree = renderer
      .create(
        <Collapsible {...props} trigger="Collapsible row" isOpen={true} />,
        options
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render with icon", () => {
    const options = { createNodeMock };
    const tree = renderer.create(<Collapsible {...props} />, options).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render without trigger", () => {
    const options = { createNodeMock };
    const tree = renderer
      .create(<Collapsible>{props.children}</Collapsible>, options)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
