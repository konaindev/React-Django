import CampaignPlan from "./index";
import renderer from "react-test-renderer";

describe("CampaignPlan", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CampaignPlan />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
