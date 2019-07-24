import renderer from "react-test-renderer";

import { props as reportLinkProps } from "../report_links/report_links.stories";
import { props as user } from "../user_menu/props";
import { project } from "../project_page/props";

import ReportPageChrome from "./index";

describe("ReportPageChrome", () => {
  it("renders correctly", () => {
    const props = {
      ...reportLinkProps,
      project,
      user: user,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer.create(<ReportPageChrome {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
