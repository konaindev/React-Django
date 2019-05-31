import cn from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";

import Button from "../button";
import Input from "../input";
import Select from "../select";

import "./add_property_form.scss";

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
  className: PropTypes.string
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
      <div
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
      <form className="add-property-form">
        <div className="add-property-form__column">
          <div className="add-property-form__image" style={this.previewStyles}>
            {this.imageInput}
            {this.closeImage}
          </div>
        </div>
        <div className="add-property-form__column">
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
              <Select
                className="add-property-form__input add-property-form__input--state"
                options={this.states}
                name="state"
                placeholder="State"
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
            <Select
              className="add-property-form__input"
              options={this.packages}
              name="package"
              placeholder="Select a Package..."
            />
          </Field>
          <Field className="add-property-form__field--button">
            <div className="add-property-form__submit-wrap">
              <Button className="add-property-form__submit" color="primary">
                SUBMIT
              </Button>
            </div>
          </Field>
        </div>
      </form>
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
