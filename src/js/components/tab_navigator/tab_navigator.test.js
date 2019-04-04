import renderer from "react-test-renderer";
import TabNavigator, { Tab } from "./index";

describe("TabNavigator", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <TabNavigator
          selectedIndex={1}
          onChange={jest.fn(() => {})}
        >
          <Tab label="Run Rate Model">Tab 1 Content here</Tab>
          <Tab label="Deadline-Driven Model">Tab 2 Content here</Tab>
        </TabNavigator>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
