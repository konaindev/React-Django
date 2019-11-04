import renderer from "react-test-renderer";

import { BrowserRouter } from "react-router-dom";
import { props as reportLinkProps } from "../report_links/props";
import { props as user } from "../user_menu/props";
import { project } from "../project_page/props";

import ReportPageChrome from "./index";
import {Provider} from "react-redux";

describe("ReportPageChrome", () => {
  it("renders correctly", () => {
    const props = {
      ...reportLinkProps,
      project,
      user: user,
      topItems: <div>topItems</div>,
      children: <div>children</div>
    };

    const tree = renderer
      .create(
        <Provider>
          <BrowserRouter>
            <ReportPageChrome {...props} />
          </BrowserRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
