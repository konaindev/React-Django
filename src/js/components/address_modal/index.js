import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import _get from "lodash/get";

import { addressModal } from "../../redux_base/actions";
import Button from "../button";
import ModalWindow from "../modal_window";

import "./address_modal.scss";

class AddressModal extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    onFinish: PropTypes.func,
    callback: PropTypes.func,
    onError: PropTypes.func,
    updateValues: PropTypes.func,
    theme: PropTypes.oneOf(["gray", "highlight"]),
    submitAction: PropTypes.func
  };

  static defaultProps = {
    isOpen: false,
    onFinish: () => {},
    updateValues: () => {},
    callback: () => {},
    onError: () => {},
    submitAction: () => {},
    title: "Confirm Office Address",
    theme: "gray"
  };

  parentCallback = () => {
    this.props.callback();
  };

  parentOnError = errors => {
    this.props.onError(errors);
  };

  parentUpdateValues = values => {
    this.props.updateValues(values);
  };

  closeModal = () => {
    this.props.dispatch(addressModal.close);
  };

  onSubmit = () => {
    const formattedAddress = _get(this.props.addresses, [
      "suggested_address",
      "formatted_address"
    ]);

    this.parentUpdateValues(_get(this.props.addresses, "suggested_address"));
    let data = this.props.data;

    // @TODO: Standardize way forms are submitted.
    // Profile update uses FormData while Create Account Profile uses object.
    try {
      data.append("office_address", formattedAddress);
    } catch (TypeError) {
      data.office_address = formattedAddress;
    }
    this.props.dispatch(
      this.props.submitAction(data, this.parentCallback, this.parentOnError)
    );

    this.closeModal();
  };

  render() {
    const { title, isOpen, theme } = this.props;
    const address = _get(this.props, "addresses.suggested_address");
    const modalClass = cx("address-modal", `address-modal--theme-${theme}`);
    const backBtnClasses = `address-modal__back-btn address-modal__back-btn--${theme}`;
    //
    // @TODO: if we want to support dark/light themes in all modals,
    //           prop names should be changed a bit
    //        <ModalWindow theme="dark | light" size="default | small" />
    //
    return (
      <ModalWindow
        className={modalClass}
        open={isOpen}
        onClose={this.closeModal}
        theme="small"
      >
        <ModalWindow.Head>{title}</ModalWindow.Head>
        <ModalWindow.Body>
          <div className="address-modal__body">
            <p className="address-caption">Suggested Address</p>
            <p>{address?.office_street}</p>
            <p>{`${address?.office_city}, ${address?.office_state}`}</p>
            <p>{address?.office_zip}</p>
            <p>{address?.office_country}</p>
          </div>
          <div className="address-modal__footer">
            <Button
              className={backBtnClasses}
              color="secondary"
              uppercase
              onClick={this.closeModal}
            >
              Go Back
            </Button>
            <Button color="primary" uppercase onClick={this.onSubmit}>
              Confirm Address
            </Button>
          </div>
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}

const mapState = state => {
  return { ...state.addressModal, ...state.general };
};
export default connect(mapState)(AddressModal);
