import renderer from "react-test-renderer";

import Input from "../input";

import FormField from "./index";

describe("FormFiled", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<FormField label="Confirm" Input={Input} type="password" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with error", () => {
    const tree = renderer
      .create(
        <FormField
          label="Confirm Password"
          error="Passwords must match"
          showError={true}
          Input={Input}
          type="password"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders with error without icon", () => {
    const tree = renderer
      .create(
        <FormField
          label="Confirm Password"
          error="Passwords must match"
          showError={true}
          Input={Input}
          type="password"
          showIcon={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders ok", () => {
    const tree = renderer
      .create(
        <FormField
          label="Confirm Password"
          showError={true}
          Input={Input}
          type="password"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders ok without icon", () => {
    const tree = renderer
      .create(
        <FormField
          label="Confirm Password"
          showError={true}
          Input={Input}
          type="password"
          showIcon={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders inline", () => {
    const tree = renderer
      .create(
        <FormField label="Confirm Password" theme="inline">
          <Input type="password" />
        </FormField>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
