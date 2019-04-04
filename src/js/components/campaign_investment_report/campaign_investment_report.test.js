import CampaignInvestmentReport from "./index";
import renderer from "react-test-renderer";
import {
  BASELINE_REPORT,
  PERFORMANCE_REPORT,
  NEGATIVE_PERFORMANCE_REPORT
} from "./campaign_investment_report.stories";

describe("CampaignInvestmentReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders baseline report correctly", () => {
    const props = {
      report: BASELINE_REPORT
    };
    const tree = renderer
      .create(<CampaignInvestmentReport {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders performance report correctly", () => {
    const props = {
      report: PERFORMANCE_REPORT
    };
    const tree = renderer
      .create(<CampaignInvestmentReport {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders negative performance report correctly", () => {
    const props = {
      report: NEGATIVE_PERFORMANCE_REPORT
    };
    const tree = renderer
      .create(<CampaignInvestmentReport {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
