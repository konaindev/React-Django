import Container from "./index";
import renderer from "react-test-renderer";

describe("Container", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<Container>I'm inside {`<Container />`}.</Container>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
