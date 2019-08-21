import renderer from "react-test-renderer";

import Input from "../input";

import AccountForm from "./index";
import { props } from "./props";

describe("AccountForm", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <AccountForm {...props}>
          <Input
            className={AccountForm.fieldClass}
            type="password"
            name="password"
            theme="highlight"
          />
        </AccountForm>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
