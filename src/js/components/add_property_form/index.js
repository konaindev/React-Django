import cn from "classnames";
import { Formik, Form, Field as FormikField, ErrorMessage } from "formik";
import _clone from "lodash/clone";
import PropTypes from "prop-types";
import React, { Component } from "react";

import CloseIcon from "../../icons/close";
import Button from "../button";
import Input from "../input";
import Select from "../select";

import "./add_property_form.scss";
import { propertySchema } from "./validators";

function FieldInput(props) {
  return (
    <div>
      <FormikField {...props} />
      <ErrorMessage className="error" name={props.name} component="div" />
    </div>
  );
}
FieldInput.propTypes = {
  name: PropTypes.string.isRequired
};

function Field(props) {
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

class WrappedFields extends Component {
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
          <FormikField name="city">
            {({ field }) => (
              <Input
                {...field}
                className="add-property-form__input add-property-form__input--city"
                placeholder="City"
                type="text"
                onFocus={this.onWrappedFocus}
              />
            )}
          </FormikField>
          <FormikField name="state">
            {({ field }) => (
              <Select
                {...field}
                onChange={obj => {
                  const values = _clone(this.props.values);
                  values["state"] = obj;
                  this.props.setValues(values);
                }}
                onBlur={() => {
                  const t = _clone(this.props.touched);
                  t.state = true;
                  this.props.setTouched(t);
                }}
                className="add-property-form__input add-property-form__input--state"
                options={this.props.states}
                placeholder="State"
                onFocus={this.onWrappedFocus}
              />
            )}
          </FormikField>
          <FormikField name="zipcode">
            {({ field }) => (
              <Input
                {...field}
                className="add-property-form__input add-property-form__input--zipcode"
                placeholder="Zipcode"
                type="text"
                onFocus={this.onWrappedFocus}
              />
            )}
          </FormikField>
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

const initialValues = {
  property_name: "",
  address: "",
  address2: "",
  city: "",
  state: null,
  zipcode: "",
  package: null
};

export default class AddPropertyForm extends Component {
  get packages() {
    return this.props.packages.map(p => ({ label: p.name, value: p.id }));
  }

  get states() {
    return this.props.states.map(s => ({ label: s.name, value: s.id }));
  }

  get previewStyles() {
    let image = this.state.image;
    if (!image) {
      return {};
    }
    return {
      backgroundImage: `url(${image})`,
      backgroundPosition: "center center",
      backgroundSize: "contain"
    };
  }

  get imageInput() {
    if (this.state.image) {
      return;
    }
    return (
      <label className="add-property-form__file">
        ADD PHOTO
        <input
          type="file"
          style={{ display: "none" }}
          onChange={this.getPhoto}
        />
      </label>
    );
  }

  get closeImage() {
    if (!this.state.image) {
      return;
    }
    return (
      <CloseIcon
        className="add-property-form__close-image"
        onClick={this.onCloseImage}
      />
    );
  }

  state = { image: null };

  getPhoto = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({ image: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  onCloseImage = () => {
    this.setState({ image: null });
  };

  render() {
    return (
      <Formik
        validationSchema={propertySchema}
        initialValues={initialValues}
        validateOnBlur={true}
      >
        {({ errors, touched, values, setTouched, setValues }) => (
          <Form
            className="add-property-form"
            action={this.props.post_url}
            method="post"
          >
            <div className="add-property-form__column">
              <div
                className="add-property-form__image"
                style={this.previewStyles}
              >
                {this.imageInput}
                {this.closeImage}
              </div>
            </div>
            <div className="add-property-form__column">
              <Field label="Property Name:">
                <FieldInput name="property_name">
                  {({ field }) => (
                    <Input
                      {...field}
                      className="add-property-form__input"
                      placeholder="Property Name"
                      type="text"
                    />
                  )}
                </FieldInput>
              </Field>
              <Field label="Address:">
                <FieldInput name="address">
                  {({ field }) => (
                    <Input
                      {...field}
                      className="add-property-form__input"
                      placeholder="Street Address 1"
                      type="text"
                    />
                  )}
                </FieldInput>
              </Field>
              <Field>
                <FieldInput name="address2">
                  {({ field }) => (
                    <Input
                      {...field}
                      className="add-property-form__input"
                      placeholder="Street Address 2"
                      type="text"
                    />
                  )}
                </FieldInput>
              </Field>
              <Field>
                <WrappedFields
                  errors={errors}
                  values={values}
                  touched={touched}
                  states={this.states}
                  setTouched={setTouched}
                  setValues={setValues}
                />
              </Field>
              <Field label="Package Option:">
                <FieldInput name="package">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="add-property-form__input"
                      options={this.packages}
                      placeholder="Select a Package..."
                      onBlur={() => {
                        const t = _clone(touched);
                        t.package = true;
                        setTouched(t);
                      }}
                      onChange={obj => {
                        const vals = _clone(values);
                        vals["package"] = obj;
                        setValues(vals);
                      }}
                    />
                  )}
                </FieldInput>
              </Field>
              <Field className="add-property-form__field--button">
                <div className="add-property-form__submit-wrap">
                  <Button
                    className="add-property-form__submit"
                    color="disabled"
                  >
                    SUBMIT
                  </Button>
                </div>
              </Field>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
AddPropertyForm.propTypes = {
  packages: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  states: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  post_url: PropTypes.string
};
