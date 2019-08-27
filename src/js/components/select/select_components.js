import React from "react";
import { components } from "react-select";

import { IconDown, IconUp, TickSmall } from "../../icons";
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

export const MenuWithDescription = props => {
  console.log(props);
  return <components.Menu className="select__menu--description" {...props} />;
};

export const OptionWithDescription = props => {
  console.log(props);
  return (
    <components.Option {...props}>
      <TickSmall className="select__tick" />
      <div>
        <div className="select__option-title">{props.data.label}</div>
        <div className="select__option-description">
          {props.data.description}
        </div>
      </div>
    </components.Option>
  );
};
