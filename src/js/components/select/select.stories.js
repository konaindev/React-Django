import { Formik } from "formik";
import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { default as Select, FormSelect, SelectSearch } from "./index";
import { geoOptions, props, propsScroll, propsGroup } from "./props";

const style = {
  background: "#FFFFFF",
  height: "600px"
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    const options = geoOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(options);
  }, 500);
};

storiesOf("Select", module)
  .add("default", () => <Select {...props} />)
  .add("group", () => <Select {...propsGroup} />)
  .add("highlight", () => <Select theme="highlight" {...props} />)
  .add("highlight group", () => <Select theme="highlight" {...propsGroup} />)
  .add("gray", () => <Select theme="gray" {...props} />)
  .add("form select", () => (
    <Formik>
      <FormSelect {...props} />
    </Formik>
  ))
  .add("Scroll", () => <Select {...propsScroll} />)
  .add("Search", () => (
    <SelectSearch
      styles={props.styles}
      loadOptions={loadOptions}
      onChange={() => {}}
    />
  ))
  .add("Search highlight", () => (
    <div style={style}>
      <SelectSearch
        theme="highlight"
        styles={props.styles}
        loadOptions={loadOptions}
        isCreatable={true}
        onChange={(option, actionName) => {
          action("onChange")(option, actionName);
        }}
      />
    </div>
  ));
