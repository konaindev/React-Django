import renderer from "react-test-renderer";

import CreatePasswordView from "./index";
import { rules } from "./props";

const validate = values => {
  return new Promise(res => {
    setTimeout(() => res(errors));
  });
};
jest.mock("rc-tooltip");

describe("CreatePasswordView", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<CreatePasswordView rules={rules} validate={validate} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
