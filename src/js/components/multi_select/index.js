import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { components } from "react-select";
import Button from "../button";

import Checkbox from "../checkbox";
import Select from "../select";

import "./multi_select.scss";

function Option(props) {
  return (
    <components.Option className="multi-select__option" {...props}>
      <Checkbox
        className="multi-select__checkbox"
        isSelected={props.isSelected}
      />
      <div className="multi-select__option-label">{props.label}</div>
    </components.Option>
  );
}

function ValueContainer({ children, ...props }) {
  let label;
  if (props.hasValue) {
    label = (
      <div className="multi-select__label">{props.selectProps.label}</div>
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
  const classes = cn({ "multi-select--has-value": props.hasValue });
  return <components.Control {...props} className={classes} />;
}

export default class MultiSelect extends React.PureComponent {
  static propTypes = {
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

  static defaultProps = {
    value: [],
    selectAllLabel: "All",
    onApply: () => {},
    label: "Select..."
  };

  state = {
    menuIsOpen: false
  };

  menuList = props => {
    const classes = cn("multi-select__option", "select__option", {
      "select__option--is-selected": this.isAllSelected
    });
    return (
      <components.MenuList {...props}>
        <div className="multi-select__options">
          <div className={classes} onClick={this.onSelectAll}>
            <Checkbox
              className="multi-select__checkbox"
              isSelected={this.isAllSelected}
            />
            <div className="multi-select__option-label">
              {this.props.selectAllLabel}
            </div>
          </div>
          {props.children}
        </div>
        <div className="multi-select__controls">
          <Button
            className="multi-select__button"
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
            onClick={this.onApply}
          >
            apply
          </Button>
        </div>
      </components.MenuList>
    );
  };

  get isAllSelected() {
    return this.props.value.length === this.props.options.length;
  }

  onChange = (options, field) => {
    this.props.onChange(options, field);
  };

  onSelectAll = () => {
    const field = {
      name: this.props.name
    };
    if (this.isAllSelected) {
      field.action = "deselect-option";
      this.props.onChange([], field);
    } else {
      field.action = "select-option";
      this.props.onChange(this.props.options, field);
    }
  };

  onReset = () => {
    const field = {
      name: this.props.name,
      action: "deselect-option"
    };
    this.props.onChange([], field);
  };

  onApply = () => {
    this.setState({ menuIsOpen: false });
    this.props.onApply();
  };

  onMenuOpen = () => {
    this.setState({ menuIsOpen: true });
  };

  onMenuClose = () => {
    this.setState({ menuIsOpen: false });
  };

  render() {
    const { className, label, onChange, ...otherProps } = this.props;
    const classes = cn("multi-select", className);
    return (
      <Select
        className={classes}
        classNamePrefix="select"
        isClearable={false}
        components={{
          Option,
          ValueContainer,
          Control,
          MenuList: this.menuList
        }}
        isMulti={true}
        hideSelectedOptions={false}
        label={label}
        closeMenuOnSelect={false}
        menuIsOpen={this.state.menuIsOpen}
        onChange={this.onChange}
        onMenuOpen={this.onMenuOpen}
        onMenuClose={this.onMenuClose}
        {...otherProps}
      />
    );
  }
}
