import React from "react";
import renderer from "react-test-renderer";

import InviteModal from "./index";
import { props, multiProps } from "./props";

jest.mock("react-responsive-modal", () => "Modal");

describe("InviteModal", () => {
  it("renders with single properties", () => {
    const tree = renderer.create(<InviteModal {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with multiple properties", () => {
    const tree = renderer.create(<InviteModal {...multiProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
