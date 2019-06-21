import renderer from "react-test-renderer";

import AddPropertyModal from "./index";
import { props } from "./props";

jest.mock("react-responsive-modal", () => "Modal");

describe("AddPropertyModal", () => {
  it("renders AddPropertyModal correctly", () => {
    const tree = renderer
      .create(<AddPropertyModal open={true} {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
