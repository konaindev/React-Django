import renderer from "react-test-renderer";

import WizardProgress from "./index";
import { steps } from "./props";

describe("WizardProgress", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<WizardProgress steps={steps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
