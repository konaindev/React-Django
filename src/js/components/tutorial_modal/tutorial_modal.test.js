import React from "react";
import renderer from "react-test-renderer";

import TutorialModal from "./index";
import { props } from "./props";

jest.mock("react-responsive-modal", () => "Modal");

describe("TutorialModal", () => {
  it("render default", () => {
    const component = renderer.create(<TutorialModal {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
    component.getInstance().nextHandler();
    expect(component.toJSON()).toMatchSnapshot();
    component.getInstance().nextHandler();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
