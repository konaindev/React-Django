import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { Close } from "../../icons";
import ModalWindow from "../modal_window";
import UserRow from "../user_row";

import "./invite_modal.scss";

class ViewMembersModal extends React.PureComponent {
  static propTypes = {
    property: PropTypes.shape({
      property_name: PropTypes.string.isRequired,
      members: PropTypes.array.isRequired
    }).isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  };

  static defaultProps = {
    isOpen: false,
    onClose() {}
  };

  render() {
    const { property, isOpen, onClose } = this.props;
    return (
      <>
        <ModalWindow
          className="invite-modal"
          theme="small"
          open={isOpen}
          onClose={onClose}
        >
          <ModalWindow.Head className="invite-modal__header">
            <React.Fragment>
              <div className="invite-modal__title">Members of</div>
              <div className="invite-modal__title invite-modal__title--name">
                &nbsp;{property.property_name}
              </div>
            </React.Fragment>
          </ModalWindow.Head>
        </ModalWindow>
      </>
    );
  }
}

export default ViewMembersModal;
