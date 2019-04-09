import BoxColumn from "./index";
import renderer from "react-test-renderer";

describe("BoxColumn", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BoxColumn>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </BoxColumn>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
