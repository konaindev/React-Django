import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import GoogleAddress from "./index";
import { googleAddresses, companyAddresses } from "./props";

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    const options = googleAddresses.filter(i =>
      i.value.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(options);
  }, 500);
};

storiesOf("GoogleAddress", module).add("default", () => (
  <div style={{ width: "360px" }}>
    <GoogleAddress
      loadOptions={loadOptions}
      companyAddresses={companyAddresses}
      onChange={(option, actionName) => {
        action("onChange")(option, actionName);
      }}
    />
  </div>
));
