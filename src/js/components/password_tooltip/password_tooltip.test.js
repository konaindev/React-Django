import renderer from "react-test-renderer";

import PasswordOverlay from "./index";
import { props } from "./props";

describe("PasswordOverlay", () => {
  it("default", () => {
    const tree = renderer.create(<PasswordOverlay {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
