import renderer from "react-test-renderer";

import Input from "../input";

import FormFiled from "./index";

describe("FormFiled", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<FormFiled label="Confirm" Input={Input} type="password" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with error", () => {
    const tree = renderer
      .create(
        <FormFiled
          label="Confirm Password"
          error="Passwords must match"
          touched={true}
          Input={Input}
          type="password"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders ok", () => {
    const tree = renderer
      .create(
        <FormFiled
          label="Confirm Password"
          touched={true}
          Input={Input}
          type="password"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders inline", () => {
    const tree = renderer
      .create(
        <FormFiled label="Confirm Password" theme="inline">
          <Input type="password" />
        </FormFiled>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
