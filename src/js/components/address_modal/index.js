import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import _get from "lodash/get";

import Button from "../button";
import { RadioButtonGroup, RadioButton } from "../formik_controls";
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

  parentCallback = () => {
    this.props.callback();
  };

  parentOnError = () => {
    this.props.onError();
  };

  closeModal = () => {
    this.props.dispatch(addressModal.close);
  };

  onSubmit = values => {
    console.log("onSubmit", values);
    const formattedAddress = _get(this.props.addresses, [
      values.addressType,
      "formatted"
    ]);

    var data = this.props.data;
    data.append("office_address", formattedAddress);
    this.props.dispatch({
      type: "API_ACCOUNT_PROFILE",
      callback: this.parentCallback,
      onError: this.parentOnError,
      data
    });
  };

  initialValues = {
    addressType: "entered_address"
  };

  renderLabel = addressType => {
    const address = _get(this.props.addresses, `${addressType}_address`);

    return (
      <div>
        <p>
          {addressType === "suggested"
            ? "Suggested Address"
            : "Original Address"}
        </p>
        <p>{address?.office_street}</p>
        <p>
          {`${address?.office_city},${address?.office_state} ${address?.office_zip}`}
        </p>
      </div>
    );
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
          <Formik
            onSubmit={this.onSubmit}
            initialValues={this.initialValues}
            ref={this.formik}
          >
            {({
              errors,
              touched,
              values,
              isValid,
              isSubmitting,
              handleChange,
              handleBlur
            }) => (
              <Form>
                <RadioButtonGroup
                  id="addressType"
                  className="rmb-radio-button-group"
                >
                  <Field
                    component={RadioButton}
                    name="addressType"
                    id="suggested_address"
                    label={this.renderLabel("suggested")}
                    className="rmb-radio-button"
                  />
                  <Field
                    component={RadioButton}
                    name="addressType"
                    id="entered_address"
                    label={this.renderLabel("entered")}
                    className="rmb-radio-button"
                  />
                </RadioButtonGroup>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  color="primary"
                  uppercase
                >
                  Confirm Address
                </Button>
              </Form>
            )}
          </Formik>
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}

const mapState = state => {
  return { ...state.addressModal, ...state.general };
};
export default connect(mapState)(AddressModal);
