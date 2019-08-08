import renderer from "react-test-renderer";

import CampaignPlanPage from "./index";
import props from "./props";
import { Provider } from "react-redux";
import { createStore } from "redux";

describe("CampaignPlanPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => props)}>
          <CampaignPlanPage />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
