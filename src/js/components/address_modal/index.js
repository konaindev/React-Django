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
    this.props.dispatch({
      type: "API_ACCOUNT_PROFILE",
      callback: this.parentCallback,
      onError: this.parentOnError,
      data
    });
  };

  render() {
    const { title, isOpen } = this.props;
    console.log(this.props);
    return (
      <ModalWindow
        className="address-modal"
        open={isOpen}
        onClose={this.closeModal}
        theme="small"
      >
        <ModalWindow.Head>{title}</ModalWindow.Head>
        <ModalWindow.Body>
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
            type="button"
            color="highlight"
            onClick={() => console.log("HI")}
          >
            Go Back
          </Button>
          <Button
            className="address-modal__nav-button"
            color="primary"
            type="button"
            onClick={this.onSubmit}
          >
            Confirm Address
          </Button>
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
