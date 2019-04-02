import Breadcrumbs from "./index";
import renderer from "react-test-renderer";

describe("Breadcrumbs", () => {
  it("renders correctly", () => {
    const props = {
      breadcrumbs: [
        {
          text: "Releases",
          link: "/releases"
        },
        {
          text: "2.15.8 Release Title | 3/21/2019"
        }
      ]
    };
    const tree = renderer.create(<Breadcrumbs {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
