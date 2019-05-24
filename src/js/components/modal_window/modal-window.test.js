import renderer from "react-test-renderer";

import ModalWindow from "./index";

jest.mock("react-responsive-modal", () => "Modal");

describe("ModalWindow", () => {
  it("render modal window with defaults correctly", () => {
    const tree = renderer
      .create(<ModalWindow open={true}>Test Text</ModalWindow>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("render modal window with Head, Body and Buttons correctly", () => {
    const tree = renderer
      .create(
        <ModalWindow open={true}>
          <ModalWindow.Head>Head</ModalWindow.Head>
          <ModalWindow.Body>Test Text</ModalWindow.Body>
          <ModalWindow.BGroup>
            <button>Button</button>
          </ModalWindow.BGroup>
        </ModalWindow>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
