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

  it("renders primary button correctly", () => {
    const tree = renderer
      .create(<Button color="primary">Primary Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders secondary button correctly", () => {
    const tree = renderer
      .create(<Button color="secondary">Secondary Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders primary outline correctly", () => {
    const tree = renderer
      .create(<Button color="outline">Outline Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders disabled-light button correctly", () => {
    const tree = renderer
      .create(<Button color="disabled-light">Disabled light Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders transparent button correctly", () => {
    const tree = renderer
      .create(<Button color="transparent">Transparent Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders warning button correctly", () => {
    const tree = renderer
      .create(<Button color="warning">Warning Button</Button>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
