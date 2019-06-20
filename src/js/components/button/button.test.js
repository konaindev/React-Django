import Button from "./index";
import renderer from "react-test-renderer";

describe("Button", () => {
  it("renders default button correctly", () => {
    const tree = renderer.create(<Button>Default Button</Button>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders selected button correctly", () => {
    const tree = renderer
      .create(<Button selected>Selected Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders disabled button correctly", () => {
    const tree = renderer
      .create(<Button color="disabled">Disabled Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
