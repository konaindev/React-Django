import { shallow, mount } from "enzyme";
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
    const tree = mount(<Input valueFormatter={formatPhone} />);
    const input = tree.find("input");
    input.instance().value = "1234567890";
    input.simulate("change");
    expect(input.getDOMNode().value).toEqual("(123) 456-7890");
  });
});
