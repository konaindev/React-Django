import _differenceBy from "lodash/differenceBy";
import _unionBy from "lodash/unionBy";
import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { components } from "react-select";

import Button from "../button";
import Checkbox from "../checkbox";
import Select from "../select";

import "./group_select.scss";

function Option(props) {
  return (
    <components.Option className="group-select__option" {...props}>
      <Checkbox isSelected={props.isSelected} />
      <div className="group-select__option-label">{props.label}</div>
    </components.Option>
  );
}

function ValueContainer({ children, ...props }) {
  let label;
  if (props.hasValue) {
    label = (
      <div className="group-select__label">{props.selectProps.label}</div>
    );
  } else {
    label = (
      <div className="select__placeholder">{props.selectProps.placeholder}</div>
    );
  }
  return (
    <components.ValueContainer {...props}>
      {label}
      {children[1]}
    </components.ValueContainer>
  );
}

function Control(props) {
  const classes = cn({ "group-select--has-value": props.hasValue });
  return <components.Control {...props} className={classes} />;
}

export default class GroupSelect extends React.PureComponent {
  menuList = props => {
    const classes = cn(
      "group-select__all",
      "group-select__option",
      "select__option",
      {
        "select__option--is-selected": this.isAllSelected
      }
    );
    return (
      <components.MenuList {...props}>
        <div className={classes} onClick={this.onSelectAll}>
          <Checkbox isSelected={this.isAllSelected} />
          <div className="group-select__option-label">
            {this.props.selectAllLabel}
          </div>
        </div>
        <div className="group-select__groups">{props.children}</div>
        <div className="group-select__controls">
          <Button
            className="group-select__button"
            color="secondary"
            uppercase={true}
            onClick={this.onReset}
          >
            reset
          </Button>
          <Button
            className="multi-select__button"
            uppercase={true}
            color="primary"
            onClick={this.props.onApply}
          >
            apply
          </Button>
        </div>
      </components.MenuList>
    );
  };

  groupHeading = props => {
    const classes = cn(
      "group-select__group",
      "group-select__option",
      "select__option",
      {
        "select__option--is-selected": this.isGroupSelect(props.children)
      }
    );
    return (
      <components.GroupHeading {...props}>
        <div
          className={classes}
          onClick={() => this.onSelectGroup(props.children)}
        >
          <Checkbox isSelected={this.isGroupSelect(props.children)} />
          <div className="group-select__option-label">{props.children}</div>
        </div>
      </components.GroupHeading>
    );
  };

  get isAllSelected() {
    return (
      this.props.value.length ===
      this.props.options.reduce((sum, o) => sum + o.options.length, 0)
    );
  }

  isGroupSelect = group => {
    const groupOptions = this.props.options.find(o => o.label === group)
      .options;
    return !_differenceBy(groupOptions, this.props.value, "value").length;
  };

  onReset = () => {
    this.props.onChange([]);
  };

  onSelectAll = () => {
    if (this.isAllSelected) {
      this.props.onChange([]);
    } else {
      const options = this.props.options.reduce(
        (acc, o) => [...acc, ...o.options],
        []
      );
      this.props.onChange(options);
    }
  };

  onSelectGroup = group => {
    let options;
    const groupOptions = this.props.options.find(o => o.label === group)
      .options;
    if (this.isGroupSelect(group)) {
      options = _differenceBy(this.props.value, groupOptions, "value");
    } else {
      options = _unionBy(this.props.value, groupOptions, "value");
    }
    this.props.onChange(options);
  };

  onChange = options => {
    return this.props.onChange(options);
  };

  render() {
    const { className, label, onChange, ...otherProps } = this.props;
    const classes = cn("group-select", className);
    return (
      <Select
        className={classes}
        isClearable={false}
        components={{
          Option,
          ValueContainer,
          Control,
          MenuList: this.menuList,
          GroupHeading: this.groupHeading
        }}
        isMulti={true}
        hideSelectedOptions={false}
        label={label}
        closeMenuOnSelect={false}
        onChange={this.onChange}
        {...otherProps}
      />
    );
  }
}

GroupSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  className: PropTypes.string,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onApply: PropTypes.func,
  selectAllLabel: PropTypes.string
};

GroupSelect.defaultProps = {
  value: [],
  selectAllLabel: "Select All",
  label: "Select...",
  onApply: () => {}
};
