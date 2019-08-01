import React from "react";
import { storiesOf } from "@storybook/react";

import CreatePasswordView from "./index";
import { rules } from "./props";

const validate = values => {
  return new Promise(res => {
    let errors = {};
    if (values.length <= 8) {
      errors.length = true;
    }
    setTimeout(() => res(errors));
  });
};

storiesOf("CreatePasswordView", module).add("default", () => (
  <CreatePasswordView rules={rules} validate={validate} />
));
