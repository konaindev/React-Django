import cn from "classnames";
import { ErrorMessage } from "formik";
import _clone from "lodash/clone";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { FormInput } from "../input";
import { FormSelect } from "../select";

export default function Field(props) {
  const className = cn("add-property-form__field", props.className);
  return (
    <div className={className}>
      <div className="add-property-form__label">{props.label}</div>
      {props.children}
    </div>
  );
}
Field.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string
};

export function FieldInput(props) {
  const { component: Component, ...otherProps } = props;
  return (
    <div>
      <Component {...otherProps} />
      <ErrorMessage className="error" name={props.name} component="div" />
    </div>
  );
}
FieldInput.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.elementType
};
FieldInput.defaultProps = {
  component: FormInput
};

export class WrappedFields extends Component {
  static fields = ["city", "state", "zipcode"];

  onWrappedFocus = e => {
    const fields = _clone(this.props.touched);
    for (const f of WrappedFields.fields) {
      fields[f] = false;
    }
    fields[e.target.name] = true;
    this.props.setTouched(fields);
  };

  get errorMessage() {
    const { errors, touched } = this.props;
    let msg;
    for (const f of WrappedFields.fields) {
      if (errors[f] && touched[f]) {
        msg = errors[f];
        break;
      }
    }
    if (!msg) {
      return;
    }
    return <div className="error">{msg}</div>;
  }

  render() {
    return (
      <div>
        <div className="add-property-form__fields-wrap">
          <FormInput
            className="add-property-form__input add-property-form__input--city"
            name="city"
            placeholder="City"
            type="text"
            onFocus={this.onWrappedFocus}
          />
          <FormSelect
            className="add-property-form__input add-property-form__input--state"
            name="state"
            options={this.props.states}
            placeholder="State"
            onFocus={this.onWrappedFocus}
          />
          <FormInput
            className="add-property-form__input add-property-form__input--zipcode"
            name="zipcode"
            placeholder="Zipcode"
            type="text"
            onFocus={this.onWrappedFocus}
          />
        </div>
        {this.errorMessage}
      </div>
    );
  }
}
WrappedFields.propTypes = {
  errors: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
  setTouched: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired
};
