import renderer from "react-test-renderer";

import TutorialView from "./index";

jest.mock("react-responsive-modal", () => "Modal");

describe("TutorialView", () => {
  afterEach(() => {
    document.cookie = "isLogin= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("render default", () => {
    const tree = renderer
      .create(<TutorialView staticUrl={"static/"} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render hidden", () => {
    document.cookie = "isLogin=true";
    const tree = renderer
      .create(<TutorialView staticUrl={"static/"} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
