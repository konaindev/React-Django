import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import ModalWindow from "../modal_window";
import Select, { SelectSearch } from "../select";
import {
  MenuWithDescription,
  OptionWithDescription,
  MultiValueComponents,
  OptionUsers,
  menuListConstructor
} from "../select/select_components";

import "./invite_modal.scss";
import UserRow from "../user_row";

export default class InviteModal extends React.PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        property_name: PropTypes.string.isRequired,
        members: PropTypes.array.isRequired
      })
    ).isRequired,
    onClose: PropTypes.func
  };

  static defaultProps = {
    open: false,
    onClose: () => {}
  };

  static roleOptions = [
    {
      label: "Admin",
      description:
        "People can edit property information, start campaigns and invite members",
      value: "admin"
    },
    {
      label: "Member",
      description:
        "People can view property info and control their notification preferences",
      value: "member"
    }
  ];

  static selectRoleComponents = {
    Menu: MenuWithDescription,
    Option: OptionWithDescription
  };

  static selectUsersComponents = {
    ...MultiValueComponents,
    Option: OptionUsers,
    IndicatorsContainer: () => null
  };

  static selectStyle = {
    singleValue: provided => ({ ...provided, right: 10 }),
    menuList: provided => ({ ...provided, overflow: "initial" })
  };

  loadUsers = (inputValue, callback) => {};

  removeUser = () => {};

  renderTitle = () => {
    let propertyName;
    if (this.props.properties.length === 1) {
      propertyName = this.props.properties[0].property_name;
    } else {
      propertyName = `${this.props.properties.length} properties`;
    }
    return (
      <React.Fragment>
        <div className="invite-modal__title">Invite to</div>
        <div className="invite-modal__title invite-modal__title--name">
          &nbsp;{propertyName}
        </div>
      </React.Fragment>
    );
  };

  renderRemoveButton = () => (
    <div className="invite-modal__remove-btn" onClick={this.removeUser}>
      Remove
    </div>
  );

  renderMembers = members => {
    return members.map(member => {
      const role = InviteModal.roleOptions.find(r => r.value === member.role);
      return (
        <div className="invite-modal__member" key={member.user_id}>
          <UserRow {...member} />
          <Select
            className="invite-modal__select-role"
            theme="transparent"
            size="small"
            styles={InviteModal.selectStyle}
            components={{
              ...InviteModal.selectRoleComponents,
              MenuList: menuListConstructor(
                this.renderRemoveButton(member.user_id)
              )
            }}
            options={InviteModal.roleOptions}
            defaultValue={role}
          />
        </div>
      );
    });
  };

  renderProperty = () => {
    if (this.props.properties.length === 1) {
      const members = this.props.properties[0].members;
      return this.renderMembers(members);
    } else {
      return null;
    }
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <ModalWindow className="invite-modal" open={open} onClose={onClose}>
        <ModalWindow.Head className="invite-modal__header">
          {this.renderTitle()}
        </ModalWindow.Head>
        <ModalWindow.Body>
          <div className="invite-modal__container invite-modal__container--select">
            <SelectSearch
              className="invite-modal__select-users"
              theme="transparent"
              size="small"
              placeholder="Type a name or an email address"
              isMulti={true}
              components={InviteModal.selectUsersComponents}
              loadOptions={this.loadUsers}
            />
            <Select
              className="invite-modal__select-role"
              theme="default"
              size="small"
              components={InviteModal.selectRoleComponents}
              options={InviteModal.roleOptions}
              defaultValue={InviteModal.roleOptions[1]}
            />
          </div>
          <div className="invite-modal__container invite-modal__container--users">
            {this.renderProperty()}
          </div>
          <div className="invite-modal__container invite-modal__container--button">
            <Button
              className="invite-modal__button"
              color="primary"
              uppercase={true}
              disabled={true}
            >
              invite
            </Button>
          </div>
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}
