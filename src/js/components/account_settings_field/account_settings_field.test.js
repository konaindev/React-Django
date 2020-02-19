import React from "react";
import renderer from "react-test-renderer";

import Input from "../input";
import AccountSettingsField from "./index";

describe("AccountSettingsField", () => {
  it("renders AccountSettingsField correctly", () => {
    const tree = renderer
      .create(
        <AccountSettingsField label="Test Field" errorName="field">
          <Input className="account-settings-field__input" theme="gray" />
        </AccountSettingsField>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
