import BoxRow from "./index";
import renderer from "react-test-renderer";

describe("BoxRow", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BoxRow>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </BoxRow>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
