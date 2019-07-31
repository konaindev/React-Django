import renderer from "react-test-renderer";

import DashboardPage from "./index";
import { props } from "./props";

describe("DashboardPage", () => {
  beforeAll(() => {
    document.cookie = "isLogin=true";
  });

  afterAll(() => {
    document.cookie = "isLogin= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("renders correctly", () => {
    const tree = renderer.create(<DashboardPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row view", () => {
    const tree = renderer
      .create(<DashboardPage {...props} viewType="row" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Row select", () => {
    const tree = renderer
      .create(
        <DashboardPage
          {...props}
          viewType="row"
          selectedProperties={[props.properties[0].property_id]}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
