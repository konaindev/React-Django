import renderer from "react-test-renderer";

import ButtonToggle from "./index";

describe("ButtonToggle", () => {
  it("renders toggle with on/off correctly", () => {
    const tree = renderer.create(<ButtonToggle />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders toggle with custom labels correctly", () => {
    const tree = renderer
      .create(
        <ButtonToggle
          innerLabelChecked="Checked"
          innerLabelUnchecked="Unchecked"
          label="Containing Label"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders toggle in medium state", () => {
    const tree = renderer
      .create(<ButtonToggle checked={ButtonToggle.STATE_ENUM.MEDIUM} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
