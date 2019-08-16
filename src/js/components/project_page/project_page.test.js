import renderer from "react-test-renderer";
import ProjectPage from "./index";
import { props } from "./props";
import { Provider } from "react-redux";
import { createStore } from "redux";

describe("ProjectPage", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={createStore(() => props)}>
          <ProjectPage {...props} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
