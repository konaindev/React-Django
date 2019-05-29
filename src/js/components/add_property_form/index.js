import PropTypes from "prop-types";
import React, { Component } from "react";

import Input from "../input";
import Select from "../select";

import "./add_property_form.scss";

function Field(props) {
  return (
    <div className="add-property-form__field">
      <div className="add-property-form__label">{props.label}</div>
      {props.children}
    </div>
  );
}
Field.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string
};

export default class AddPropertyForm extends Component {
  render() {
    return (
      <form className="add-property-form">
        <Field label="Your Name:">
          <Input
            className="add-property-form__input"
            name="name"
            placeholder="Jon Smith"
            type="text"
          />
        </Field>
        <Field label="Your Email:">
          <Input
            className="add-property-form__input"
            name="email"
            placeholder="jon.doe@gmail.com"
            type="text"
          />
        </Field>
        <Field label="Phone Number:">
          <Input
            className="add-property-form__input"
            name="phone"
            placeholder="xxx-xxx-xxxx"
            type="text"
          />
        </Field>
        <Field label="Property Name:">
          <Input
            className="add-property-form__input"
            name="property_name"
            placeholder="abc apartments"
            type="text"
          />
        </Field>
        <Field label="Address:">
          <Input
            className="add-property-form__input"
            name="address"
            placeholder="Street Address 1"
            type="text"
          />
        </Field>
        <Field>
          <Input
            className="add-property-form__input"
            name="address2"
            placeholder="Street Address 2"
            type="text"
          />
        </Field>
        <Field>
          <div className="add-property-form__fields-wrap">
            <Input
              className="add-property-form__input add-property-form__input--city"
              name="city"
              placeholder="City"
              type="text"
            />
            <Input
              className="add-property-form__input add-property-form__input--state"
              name="state"
              type="text"
            />
            <Input
              className="add-property-form__input add-property-form__input--zipcode"
              name="zipcode"
              placeholder="Zipcode"
              type="text"
            />
          </div>
        </Field>
        <Field label="Package Option:">
          <Input
            className="add-property-form__input"
            name="package"
            placeholder="Select a Package..."
            type="text"
          />
        </Field>
      </form>
    );
  }
}
