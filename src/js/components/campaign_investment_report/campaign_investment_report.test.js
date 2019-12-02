import { shallow } from "enzyme";

import CampaignInvestmentReport from "./index";
import {
  props_baseline,
  props_performance,
  props_negative_performance
} from "./props";

describe("CampaignInvestmentReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    let tree = shallow(<CampaignInvestmentReport {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<CampaignInvestmentReport.HeadlineNumbers {...props_baseline} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    let tree = shallow(<CampaignInvestmentReport {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<CampaignInvestmentReport.HeadlineNumbers {...props_performance} />);
    expect(tree.debug()).toMatchSnapshot();
  });

  it("renders negative performance report correctly", () => {
    let tree = shallow(<CampaignInvestmentReport {...props_negative_performance} />);
    expect(tree.debug()).toMatchSnapshot();

    tree = shallow(<CampaignInvestmentReport.HeadlineNumbers {...props_negative_performance} />);
    expect(tree.debug()).toMatchSnapshot();
  });
});
