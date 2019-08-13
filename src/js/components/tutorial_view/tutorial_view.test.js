import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { createStore } from "redux";

import TutorialView from "./index";

jest.mock("react-responsive-modal", () => "Modal");
const _ = x => createStore(() => ({ tutorial: { tutorialView: x } }));

describe("TutorialView", () => {
  it("render default", () => {
    const props = {
      static_url: "static/",
      is_show_tutorial: true
    };
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <TutorialView />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render hidden", () => {
    const props = {
      static_url: "static/",
      is_show_tutorial: false
    };
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <TutorialView />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
