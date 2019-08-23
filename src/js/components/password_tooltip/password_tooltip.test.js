import renderer from "react-test-renderer";

import PasswordOverlay from "./index";
import { props } from "./props";

describe("PasswordOverlay", () => {
  it("default", () => {
    const tree = renderer.create(<PasswordOverlay {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("correct password", () => {
    const tree = renderer
      .create(<PasswordOverlay password="P@ssw0rd" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  const errors = {
    length: true,
    characters: true,
    personal: true,
    used: true
  };
  it("with errors", () => {
    const tree = renderer
      .create(
        <PasswordOverlay password="P@ssw0rd" errors={errors} {...props} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
