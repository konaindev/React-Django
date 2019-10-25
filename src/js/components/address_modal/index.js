// import cn from "classnames";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../button";
import ModalWindow from "../modal_window";
import { addressModal } from "../../state/actions";

import "./address_modal.scss";

class AddressModal extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onFinish: PropTypes.func,
    callback: PropTypes.func,
    onError: PropTypes.func,
    theme: PropTypes.string
  };

  static defaultProps = {
    isOpen: false,
    onClose: () => {},
    onFinish: () => {},
    title: "Verify Office Address",
    theme: "dark"
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: ""
    };
    this.parentCallback = this.parentCallback.bind(this);
    this.parentOnError = this.parentOnError.bind(this);
  }

  parentCallback() {
    this.props.callback();
  }

  parentOnError() {
    this.props.onError();
  }

  closeModal = () => {
    this.props.dispatch(addressModal.close);
  };

  componentDidUpdate() {
    if (!this.state.selectedAddress) {
      this.setState({
        selectedAddress: this.props.addresses?.suggested_address
          .formatted_address
      });
    }
  }

  handleChange = event => {
    this.setState({ selectedAddress: event.target.value });
  };

  onSubmit = () => {
    var data = this.props.data;
    data.append("office_address", this.state.selectedAddress);
    // this.props.onFinish(data, this.props);
    // console.log(this.props);
    this.props.dispatch({
      type: "API_ACCOUNT_PROFILE",
      callback: this.parentCallback,
      onError: this.props.setErrorMessages,
      data
    });
  };

  render() {
    const { title, isOpen } = this.props;
    return (
      <ModalWindow
        className="address-modal"
        open={isOpen}
        onClose={this.closeModal}
        theme="small"
      >
        <ModalWindow.Head>{title}</ModalWindow.Head>
        <ModalWindow.Body>
          <form>
            <fieldset id="address_selection">
              <input
                type="radio"
                value={
                  this.props.addresses?.suggested_address.formatted_address
                }
                name="suggested_address"
                onChange={this.handleChange}
                checked={
                  this.state.selectedAddress ==
                  this.props.addresses?.suggested_address.formatted_address
                }
              ></input>
              Suggested Address
              <p>
                {this.props.addresses?.suggested_address?.office_street}
                <p>
                  {" "}
                  {this.props.addresses?.suggested_address?.office_city},{" "}
                  {this.props.addresses?.suggested_address?.office_state}{" "}
                  {this.props.addresses?.suggested_address?.office_zip}
                </p>
              </p>
              <Button
                className="address-modal__nav-button"
                color="highlight"
                type="button"
                onClick={this.onSubmit}
              >
                Use this Address
              </Button>
              <br></br>
              <input
                type="radio"
                value={this.props.addresses?.entered_address.formatted_address}
                name="entered_address"
                onChange={this.handleChange}
                checked={
                  this.state.selectedAddress ==
                  this.props.addresses?.entered_address.formatted_address
                }
              ></input>
              Original Address
              <p>
                {this.props.addresses?.entered_address?.office_street}
                <p>
                  {this.props.addresses?.entered_address?.office_city},{" "}
                  {this.props.addresses?.entered_address?.office_state}{" "}
                  {this.props.addresses?.entered_address?.office_zip}
                </p>
              </p>
              <Button
                className="address-modal__nav-button"
                color="highlight"
                type="submit"
                onClick={this.onSubmit}
              >
                Use this Address
              </Button>
            </fieldset>
          </form>
          {/* <Formik ref={this.formik} onSubmit={() => console.log("HI")}>
            {({ errors, touched, values, isValid, setTouched, setValues }) => (
              <Form>
                <Field component="select" name="color">
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </Field> */}
          {/* <h2>Radio group</h2>
                <RadioButtonGroup
                  id="radioGroup"
                  label="One of these please"
                  value={values.radioGroup}
                  error={errors.radioGroup}
                  touched={touched.radioGroup}
                >
                  <Field
                    component={RadioButton}
                    name="radioGroup"
                    id="radioOption1"
                    label="Choose this option"
                  />
                  <Field
                    component={RadioButton}
                    name="radioGroup"
                    id="radioOption2"
                    label="Or choose this one"
                  />
                </RadioButtonGroup> */}
          {/* </Form>
            )}
          </Formik> */}
          {/* <div className="address-modal__container">
            <Checkbox isSelected={true}></Checkbox>
            <div className="address-modal__address-container">
              <div className="address-modal__address-container--title">
                Suggested Address
              </div>
              <div className="address-modal__address-container--address">
                <span>
                  {this.props.addresses?.suggested_address?.office_street}
                  <p />
                  {this.props.addresses?.suggested_address?.office_city},{" "}
                  {this.props.addresses?.suggested_address?.office_state}{" "}
                  {this.props.addresses?.suggested_address?.office_zip}
                </span>
              </div>
              <div>
                <Button
                  className="address-modal__nav-button"
                  color="highlight"
                  onClick={this.onSubmit}
                >
                  Use this Address
                </Button>
              </div>
            </div>
          </div>
          <div className="address-modal__container">
            <Checkbox isSelected={true}></Checkbox>
            <div className="address-modal__address-container">
              <div className="address-modal__address-container--title">
                Original Address
              </div>
            </div>
            <div className="address-modal__address-container--address">
              <span>
                {this.props.addresses?.entered_address?.office_street}
                <p />
                {this.props.addresses?.entered_address?.office_city},{" "}
                {this.props.addresses?.entered_address?.office_state}{" "}
                {this.props.addresses?.entered_address?.office_zip}
              </span>
            </div>
          </div> */}
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}

const mapState = state => {
  return { ...state.addressModal, ...state.general };
};
export default connect(mapState)(AddressModal);
