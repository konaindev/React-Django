import PropTypes from "prop-types";
import React from "react";

import { viewMembersModal as actions } from "../../redux_base/actions";

import Button from "../button";
import ModalWindow from "../modal_window";
import UserRow from "../user_row";

import InviteModal from "./invite";
import "./members_modal.scss";

export default class ViewMembersModalUI extends React.PureComponent {
  static propTypes = {
    property: PropTypes.shape({
      property_name: PropTypes.string.isRequired,
      members: PropTypes.array.isRequired
    }).isRequired,
    isOpen: PropTypes.bool
  };

  static defaultProps = {
    isOpen: false
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

  onClose = () => this.props.dispatch(actions.close);

  render() {
    const { property, isOpen } = this.props;
    return (
      <>
        <ModalWindow
          className="invite-modal"
          theme="small"
          open={isOpen}
          onClose={this.onClose}
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
                onClick={this.onClose}
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
