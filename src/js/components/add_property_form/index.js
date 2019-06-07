import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React, { Component } from "react";

import CloseIcon from "../../icons/close";
import Button from "../button";
import { FormSelect } from "../select";

import "./add_property_form.scss";
import { default as Field, FieldInput, WrappedFields } from "./fields";
import { propertySchema } from "./validators";

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
          accept="image/*"
          type="file"
          name="photo"
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

  onSubmit = () => {};

  render() {
    return (
      <Formik
        validationSchema={propertySchema}
        initialValues={initialValues}
        validateOnBlur={true}
        onSubmit={this.onSubmit}
      >
        {({ errors, touched, values, isValid, setTouched, setValues }) => (
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
                <FieldInput
                  className="add-property-form__input"
                  name="property_name"
                  placeholder="Property Name"
                  type="text"
                />
              </Field>
              <Field label="Address:">
                <FieldInput
                  className="add-property-form__input"
                  name="address"
                  placeholder="Street Address 1"
                  type="text"
                />
              </Field>
              <Field>
                <FieldInput
                  className="add-property-form__input"
                  name="address2"
                  placeholder="Street Address 2"
                  type="text"
                />
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
                <FieldInput
                  className="add-property-form__input"
                  name="package"
                  options={this.packages}
                  placeholder="Select a Package..."
                  component={FormSelect}
                />
              </Field>
              <Field className="add-property-form__field--button">
                <div className="add-property-form__submit-wrap">
                  <Button
                    className="add-property-form__submit"
                    type="submit"
                    color={isValid ? "primary" : "disabled"}
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
