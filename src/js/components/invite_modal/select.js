import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import Select from "../select";
import { menuListConstructor, MenuPortal } from "../select/select_components";

export default class SelectRole extends React.PureComponent {
  static propTypes = {
    member: PropTypes.object.isRequired,
    adminCount: PropTypes.number.isRequired,
    property: PropTypes.object.isRequired,
    roleOptions: PropTypes.array.isRequired,
    components: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,
    onChangeRole: PropTypes.func.isRequired,
    openRemoveModal: PropTypes.func.isRequired
  };

  static selectStyle = {
    singleValue: provided => ({ ...provided, right: 10 }),
    menuList: provided => ({ ...provided, overflow: "initial" }),
    menuPortal: provided => ({ ...provided, zIndex: 1000, height: 0 })
  };

  closeMenuOnScroll = () => this.menuIsOpen;

  openMenuHandler = () => {
    this.menuIsOpen = true;
  };

  closeMenuHandler = () => {
    this.menuIsOpen = false;
  };

  canRemove = () => {
    return !(this.props.adminCount === 1 && this.props.member.role === "admin");
  };

  renderRemoveButton = () => {
    const classes = cn("invite-modal__remove-btn", {
      "invite-modal__remove-btn--disabled": !this.canRemove()
    });
    return (
      <div className={classes} onClick={this.onRemoveHandler}>
        Remove
      </div>
    );
  };

  isOptionDisabled = option => {
    return (
      this.props.adminCount === 1 &&
      option.value === "member" &&
      this.props.member.role === "admin"
    );
  };

  onRemoveHandler = () => {
    if (this.canRemove()) {
      this.props.openRemoveModal(this.props.property, this.props.member);
    }
  };

  onChangeHandler = option => {
    this.props.onChangeRole(
      option.value,
      this.props.property,
      this.props.member
    );
  };

  render() {
    const { member, components, roleOptions, role } = this.props;
    return (
      <Select
        className="invite-modal__select-role"
        theme="transparent"
        size="small"
        styles={SelectRole.selectStyle}
        components={{
          ...components,
          MenuList: menuListConstructor(
            this.renderRemoveButton(member.user_id)
          ),
          MenuPortal
        }}
        options={roleOptions}
        isOptionDisabled={this.isOptionDisabled}
        defaultValue={role}
        menuPortalTarget={document.body}
        onChange={this.onChangeHandler}
        closeMenuOnScroll={this.closeMenuOnScroll}
        onMenuOpen={this.openMenuHandler}
        onMenuClose={this.closeMenuHandler}
        menuPosition="absolute"
      />
    );
  }
}
