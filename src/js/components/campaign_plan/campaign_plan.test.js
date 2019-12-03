import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import CampaignPlan from "./index";
import CampaignPlanProps from "./campaign_plan.props";

describe("CampaignPlan", () => {
  it("renders correctly", () => {
    const tree = shallow(<CampaignPlan {...CampaignPlanProps} />);
    expect(tree.debug()).toMatchSnapshot();

    tree.setState({ activeTab: "reputation_building" });
    expect(tree.debug()).toMatchSnapshot();
  });
});
