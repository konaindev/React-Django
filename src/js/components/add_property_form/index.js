import { Formik, Form } from "formik";
import _clone from "lodash/clone";
import PropTypes from "prop-types";
import React, { Component } from "react";

import CloseIcon from "../../icons/close";
import Button from "../button";
import { FormSelect } from "../select";

import "./add_property_form.scss";
import { default as Field, FieldInput, WrappedFields } from "./fields";
import { propertySchema } from "./validators";

const initialValues = {
  building_photo: null,
  property_name: "",
  street_address_1: "",
  street_address_2: "",
  city: "",
  state: null,
  zip_code: "",
  package: null
};

export default class AddPropertyForm extends Component {
  constructor(props) {
    super(props);
    this.formik = React.createRef();
  }

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
          name="building_photo"
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
    this.formik.current.setFieldValue("photo", file);
  };

  onCloseImage = () => {
    this.setState({ image: null });
  };

  onSubmit = (values, actions) => {
    const data = _clone(values);
    data.product_type = values.product_type.value;
    data.state = values.state.value;
    const formData = new FormData();
    for (const k of Object.keys(data)) {
      formData.append(k, data[k]);
    }
    fetch(this.props.post_url, {
      method: "POST",
      body: formData
    }).then(() => actions.setSubmitting(false));
  };

  render() {
    return (
      <Formik
        validationSchema={propertySchema}
        initialValues={initialValues}
        validateOnBlur={true}
        onSubmit={this.onSubmit}
        ref={this.formik}
      >
        {({
          errors,
          touched,
          values,
          isValid,
          setTouched,
          setValues,
          setFieldValue
        }) => (
          <Form
            className="add-property-form"
            action={this.props.post_url}
            method="post"
            autoComplete="off"
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
                  name="street_address_1"
                  placeholder="Street Address 1"
                  type="text"
                />
              </Field>
              <Field>
                <FieldInput
                  className="add-property-form__input"
                  name="street_address_2"
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
                  name="product_type"
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
