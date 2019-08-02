import React from "react";
import { components } from "react-select";

import { IconDown, IconUp } from "../../icons";
import Button from "../button";

export function DropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <IconDown className="select__dropdown-arrow select__dropdown-arrow--down" />
      <IconUp className="select__dropdown-arrow select__dropdown-arrow--up" />
    </components.DropdownIndicator>
  );
}

export const FormatCreateLabel = () => {
  return (
    <Button className="select-search__add-button" color="primary">
      Add +
    </Button>
  );
};

export const OptionWithAdd = props => {
  if (props.data.__isNew__) {
    return (
      <components.Option
        {...props}
        className="select-search__button-container"
      />
    );
  }
  return <components.Option {...props} />;
};
