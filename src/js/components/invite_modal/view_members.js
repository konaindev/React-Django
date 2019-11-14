import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { Close } from "../../icons";
import Button from "../button";
import ModalWindow from "../modal_window";
import UserRow from "../user_row";

import InviteModal from "./index";

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

  renderMembers = () => {
    const property = this.props.property;
    if (!property || !property.members) {
      return null;
    }
    return property.members.map(member => {
      let roleLabel;
      const role = InviteModal.roleOptions.find(r => r.value === member.role);
      if (role) {
        roleLabel = role.label;
      }
      return (
        <div className="invite-modal__member" key={member.user_id}>
          <UserRow {...member} />
          <div className="invite-modal__role">{roleLabel}</div>
        </div>
      );
    });
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
          <ModalWindow.Body>
            <div className="invite-modal__container invite-modal__container--users">
              {this.renderMembers()}
            </div>
            <div className="invite-modal__container invite-modal__container--button">
              <Button
                className="invite-modal__button"
                color="primary"
                uppercase={true}
                onClick={this.props.onClose}
              >
                okay
              </Button>
            </div>
          </ModalWindow.Body>
        </ModalWindow>
      </>
    );
  }
}

export default ViewMembersModal;
