import React from "react";
import { components } from "react-select";

import Button from "../button";
import UserRow from "../user_row";
import { IconDown, IconUp, TickSmall, Close } from "../../icons";

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

export const MenuWithDescription = props => (
  <components.Menu className="select__menu--description" {...props} />
);

export const OptionWithDescription = props => (
  <components.Option {...props}>
    <TickSmall className="select__tick" />
    <div>
      <div className="select__option-title">{props.data.label}</div>
      <div className="select__option-description">{props.data.description}</div>
    </div>
  </components.Option>
);

const MultiValueContainer = props => {
  const innerProps = {
    ...props.innerProps,
    className: "select-multi-value"
  };
  return <components.MultiValueContainer {...props} innerProps={innerProps} />;
};

const MultiValueLabel = props => {
  const innerProps = {
    ...props.innerProps,
    className: "select-multi-value__label"
  };
  return <components.MultiValueLabel {...props} innerProps={innerProps} />;
};

const MultiValueRemove = props => {
  const innerProps = {
    ...props.innerProps,
    className: "select-multi-value__close"
  };
  return (
    <components.MultiValueRemove {...props} innerProps={innerProps}>
      <Close />
    </components.MultiValueRemove>
  );
};

export const MultiValueComponents = {
  MultiValueContainer,
  MultiValueLabel,
  MultiValueRemove
};

export const OptionUsers = props => (
  <components.Option {...props}>
    <UserRow {...props.data} />
  </components.Option>
);

export const menuListConstructor = component => props => (
  <components.MenuList {...props}>
    {props.children}
    <components.Option cx={() => {}} getStyles={() => {}}>
      {component}
    </components.Option>
  </components.MenuList>
);
