import renderer from "react-test-renderer";
import ProjectDropDown from "./index";

describe("ProjectDropDown", () => {
  const project = { name: "Portland Multi Family", public_id: "pro_example" };

  it("renders without building image correctly", () => {
    const props = {
      project: {
        ...project,
        building_image: null
      }
    };

    const tree = renderer.create(<ProjectDropDown {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with building image correctly", () => {
    const props = {
      project: {
        ...project,
        building_image: null
      }
    };

    const tree = renderer.create(<ProjectDropDown {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
