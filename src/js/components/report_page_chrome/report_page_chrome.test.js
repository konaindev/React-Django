import renderer from "react-test-renderer";
import ReportPageChrome from "./index";
import { props as reportLinkProps } from "../report_links/report_links.stories";

describe("ReportPageChrome", () => {
  it("renders correctly", () => {
    const project = { name: "Portland Multi Family", public_id: "pro_example" };

    const props = {
      ...reportLinkProps,
      project: project,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer.create(<ReportPageChrome {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
