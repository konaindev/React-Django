import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import Collapsible from "../collapsible";
import ModalWindow from "../modal_window";
import Select, { SelectSearch } from "../select";
import {
  MenuWithDescription,
  OptionWithDescription,
  MultiValueComponents,
  OptionUsers,
  InputWithPlaceholder
} from "../select/select_components";
import UserRow from "../user_row";
import UserIconList from "../user_icon_list";
import { Close } from "../../icons";
import { isValidEmail } from "../../utils/validators";
import { inviteModal, dashboard } from "../../redux_base/actions";

import SelectRole from "./select";
import "./invite_modal.scss";

export default class InviteModal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        property_name: PropTypes.string.isRequired,
        members: PropTypes.array.isRequired
      })
    ).isRequired,
    removeModalIsOpen: PropTypes.bool,
    remove: PropTypes.object
  };

  static defaultProps = {
    isOpen: false,
    removeModalIsOpen: false,
    remove: {}
  };

  static roleOptions = [
    {
      label: "Admin",
      description: "People can edit property information and invite members",
      value: "admin"
    },
    {
      label: "Member",
      description:
        "People can view property info and control their notification preferences",
      value: "member"
    }
  ];

  static initRole = InviteModal.roleOptions[1];

  static selectRoleComponents = {
    Menu: MenuWithDescription,
    Option: OptionWithDescription
  };

  static selectUsersComponents = {
    ...MultiValueComponents,
    Option: OptionUsers,
    Input: InputWithPlaceholder,
    Placeholder: () => null,
    IndicatorsContainer: () => null
  };

  static searchStyle = {
    noOptionsMessage: () => {}
  };

  constructor(props) {
    super(props);
    this.selectSearchRef = React.createRef();
    this.state = {
      selectedMembers: [],
      inviteRole: InviteModal.initRole
    };
  }

  get inviteIsDisabled() {
    return !this.state.selectedMembers.length;
  }

  userToOptions = callback => users =>
    callback(
      users.map(u => ({
        ...u,
        value: u.user_id
      }))
    );

  loadUsers = (inputValue, callback) => {
    clearTimeout(this.loadUsersTimeOut);
    this.loadUsersTimeOut = setTimeout(() => {
      this.props.dispatch(
        inviteModal.getUsers(inputValue, this.userToOptions(callback))
      );
    }, 300);
  };

  changeRole = (role, property, member) => {
    this.props.dispatch(inviteModal.changeRole(role, property, member));
  };

  removeUser = () => {
    const { property, member } = this.props.remove;
    this.props.dispatch(inviteModal.removeMember(property, member));
  };

  openRemoveModal = (property, member) => {
    this.props.dispatch(inviteModal.openRemoveModal(property, member));
  };

  closeRemoveModal = () => {
    this.props.dispatch(inviteModal.closeRemoveModal);
  };

  removeProperty = e => {
    e.stopPropagation();
    const propertyId = e.target.dataset?.propertyId;
    const selectedProperties = this.props.properties.filter(
      p => p.property_id !== propertyId
    );
    this.props.dispatch(dashboard.updateStore({ selectedProperties }));
  };

  openModal = () => {
    this.selectSearchRef.current.focus();
  };

  closeModal = () => {
    this.props.dispatch(inviteModal.close);
  };

  selectMember = members => {
    this.setState({
      selectedMembers: members || []
    });
  };

  inviteMembers = () => {
    this.props.dispatch(
      inviteModal.addMembers({
        body: {
          projects: this.props.properties,
          members: this.state.selectedMembers,
          role: this.state.inviteRole.value
        }
      })
    );
    this.setState({ inviteRole: InviteModal.initRole });
  };

  formatOptionLabel = data => data.account_name || data.value;

  noOptionsMessage = () => (
    <div className="invite-modal__user-not-found">User not found</div>
  );

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

  renderMembers = property => {
    if (!property || !property.members) {
      return null;
    }
    const adminCount = property.members.filter(m => m.role === "admin").length;
    return property.members.map(member => {
      const role = InviteModal.roleOptions.find(r => r.value === member.role);
      return (
        <div className="invite-modal__member" key={member.user_id}>
          <UserRow {...member} />
          <SelectRole
            member={member}
            property={property}
            role={role}
            adminCount={adminCount}
            components={InviteModal.selectRoleComponents}
            roleOptions={InviteModal.roleOptions}
            openRemoveModal={this.openRemoveModal}
            onChangeRole={this.changeRole}
          />
        </div>
      );
    });
  };

  renderProperty = () => {
    return this.props.properties.map(property => (
      <Collapsible
        className="invite-modal__collapsible"
        isOpen={false}
        renderChild={true}
        trigger={this.renderPropertyRow(property)}
        key={property.property_id}
      >
        <div className="invite-modal__collapsible-members">
          {this.renderMembers(property)}
        </div>
      </Collapsible>
    ));
  };

  renderPropertyRow = property => {
    const numberMembers = property.members?.length;
    return (
      <div className="invite-modal__trigger">
        <div className="invite-modal__collapsible-container">
          <Collapsible.Icon className="invite-modal__collapsible-icon" />
          <div>
            <div className="invite-modal__property-name">
              {property.property_name}
            </div>
            <div className="invite-modal__users-count">
              {numberMembers} {numberMembers !== 1 ? "Users" : "User"}
            </div>
          </div>
        </div>
        <div className="invite-modal__collapsible-container">
          <UserIconList users={property.members} />
          <Close
            className="invite-modal__collapsible-close"
            data-property-id={property.property_id}
            onClick={this.removeProperty}
          />
        </div>
      </div>
    );
  };

  renderPropertyOrMembers = () => {
    if (this.props.properties.length === 1) {
      return this.renderMembers(this.props.properties[0]);
    } else {
      return this.renderProperty();
    }
  };

  changeInviteRoleHandler = roleOption => {
    this.setState({ inviteRole: roleOption });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <React.Fragment>
        <ModalWindow
          className="invite-modal"
          theme="small"
          open={isOpen}
          onClose={this.closeModal}
          onEntered={this.openModal}
        >
          <ModalWindow.Head className="invite-modal__header">
            {this.renderTitle()}
          </ModalWindow.Head>
          <ModalWindow.Body>
            <div className="invite-modal__container invite-modal__container--select">
              <SelectSearch
                className="invite-modal__select-users"
                theme="transparent"
                size="small"
                placeholder="Name or email"
                noOptionsMessage={this.noOptionsMessage}
                styles={InviteModal.searchStyle}
                isMulti={true}
                components={InviteModal.selectUsersComponents}
                loadOptions={this.loadUsers}
                isCreatable={true}
                isValidNewOption={isValidEmail}
                formatOptionLabel={this.formatOptionLabel}
                defaultOptions={[]}
                onChange={this.selectMember}
                selectSearchRef={this.selectSearchRef}
              />
              <Select
                className="invite-modal__select-role"
                theme="default"
                size="small"
                components={InviteModal.selectRoleComponents}
                options={InviteModal.roleOptions}
                value={this.state.inviteRole}
                onChange={this.changeInviteRoleHandler}
              />
            </div>
            <div className="invite-modal__container invite-modal__container--users">
              {this.renderPropertyOrMembers()}
            </div>
            <div className="invite-modal__container invite-modal__container--button">
              <Button
                className="invite-modal__button"
                color="primary"
                uppercase={true}
                disabled={this.inviteIsDisabled}
                onClick={this.inviteMembers}
              >
                invite
              </Button>
            </div>
          </ModalWindow.Body>
        </ModalWindow>
        <ModalWindow
          className="invite-remove-window"
          theme="small"
          open={this.props.removeModalIsOpen}
          onClose={this.closeRemoveModal}
        >
          <ModalWindow.Head>Are you sure?</ModalWindow.Head>
          <ModalWindow.Body className="invite-remove-window__body">
            Removing{" "}
            <span className="invite-remove-window__name">
              {this.props.remove?.member?.account_name}
            </span>{" "}
            will revoke their access to this property.
            <div className="invite-remove-window__controls">
              <Button
                className="invite-remove-window__button"
                color="secondary"
                uppercase={true}
                onClick={this.closeRemoveModal}
              >
                Cancel
              </Button>
              <Button
                className="invite-remove-window__button"
                color="warning"
                uppercase={true}
                onClick={this.removeUser}
              >
                Remove
              </Button>
            </div>
          </ModalWindow.Body>
        </ModalWindow>
      </React.Fragment>
    );
  }
}
