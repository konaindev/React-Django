import renderer from "react-test-renderer";

import CampaignPlanPage from "./index";
import props from "./props";

describe("CampaignPlanPage", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CampaignPlanPage {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
