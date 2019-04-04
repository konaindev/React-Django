import BoxTable from "./index";
import renderer from "react-test-renderer";

describe("BoxTable", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BoxTable>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </BoxTable>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
