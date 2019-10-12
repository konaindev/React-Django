import CampaignInvestmentReport from "./index";
import renderer from "react-test-renderer";
import {
  props_baseline,
  props_performance,
  props_negative_performance
} from "./props";

describe("CampaignInvestmentReport", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  // it("renders baseline report correctly", () => {
  //   const tree = renderer
  //     .create(<CampaignInvestmentReport {...props_baseline} />)
  //     .toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  // it("renders performance report correctly", () => {
  //   const tree = renderer
  //     .create(<CampaignInvestmentReport {...props_performance} />)
  //     .toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  it("renders negative performance report correctly", () => {
    const tree = renderer
      .create(<CampaignInvestmentReport {...props_negative_performance} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
