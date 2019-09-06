import React from "react";
import renderer from "react-test-renderer";

import { formatPhone } from "../../utils/formatters";
import Input from "./index";

describe("Input", () => {
  it("render text input", () => {
    const tree = renderer.create(<Input type="text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render text input highlight", () => {
    const tree = renderer
      .create(<Input type="text" theme="highlight" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render text with gray theme", () => {
    const tree = renderer.create(<Input type="text" theme="gray" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render with formatted phone number", () => {
    const tree = renderer
      .create(<Input value="1234567890" valueFormatter={formatPhone} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
