import React from "react";

import Select from "../select";
import { menuListConstructor, MenuPortal } from "../select/select_components";
import PropTypes from "prop-types";

export default class SelectRole extends React.PureComponent {
  static propTypes = {
    member: PropTypes.object.isRequired,
    roleOptions: PropTypes.array.isRequired,
    components: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,
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

  renderRemoveButton = () => (
    <div
      className="invite-modal__remove-btn"
      onClick={this.props.openRemoveModal}
    >
      Remove
    </div>
  );

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
        defaultValue={role}
        menuPortalTarget={document.body}
        closeMenuOnScroll={this.closeMenuOnScroll}
        onMenuOpen={this.openMenuHandler}
        onMenuClose={this.closeMenuHandler}
      />
    );
  }
}
