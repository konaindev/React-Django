import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _get from "lodash/get";

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

  render() {
    const { title, isOpen } = this.props;
    const address = _get(this.props, "addresses.suggested_address");

    return (
      <ModalWindow
        className="address-modal"
        open={isOpen}
        onClose={this.closeModal}
        theme="small"
      >
        <ModalWindow.Head>{title}</ModalWindow.Head>
        <ModalWindow.Body>
          <div className="address-modal__body">
            <p>Suggested Address</p>
            <p>{address?.office_street}</p>
            <p>{`${address?.office_city}, ${address?.office_state}`}</p>
            <p>{address?.office_zip}</p>
          </div>
          <div className="address-modal__footer">
            <Button
              color="secondary"
              uppercase
              onClick={() => console.log("HI")}
            >
              Go Back
            </Button>
            <Button color="primary" uppercase onClick={this.onSubmit}>
              Confirm Address
            </Button>
          </div>
          {/* <input
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
              </Button> */}
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}

const mapState = state => {
  return { ...state.addressModal, ...state.general };
};
export default connect(mapState)(AddressModal);
