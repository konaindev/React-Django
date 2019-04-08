import DashboardPage from "./index";
import renderer from "react-test-renderer";

describe("DashboardPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<DashboardPage />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
