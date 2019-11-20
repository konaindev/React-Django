import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import EmailReportsContainer from "../../containers/account_settings/email_reports";
import { Email, Lock, Profile } from "../../icons";
import ProjectPageChrome from "../project_page_chrome";
import LoaderContainer from "../../containers/account_settings/loader";
import AccountSecurity from "./account_security";
import ProfileTab from "./profile";
import "./account_settings.scss";

const navLinks = {
  links: [
    {
      id: "portfolio",
      name: "Portfolio",
      url: "/dashboard"
    },
    {
      id: "portfolio-analysis",
      name: "Portfolio Analysis",
      url: "/portfolio/table"
    }
  ],
  selected_link: ""
};

const menuItemsData = {
  profile: {
    name: "Profile",
    iconComponent: Profile,
    component: ProfileTab
  },
  lock: {
    name: "Security",
    iconComponent: Lock,
    component: AccountSecurity
  },
  email: {
    name: "Email Preferences",
    iconComponent: Email,
    component: EmailReportsContainer
  }
};

function MenuItems({ item, selectItem, itemsOrder }) {
  const tabsUI = itemsOrder.map(id => {
    const itemData = menuItemsData[id];
    const Icon = itemData.iconComponent;
    const itemClass = cn("account-settings__menu-item", {
      "account-settings__menu-item--active": id === item
    });
    return (
      <div className={itemClass} key={id} onClick={() => selectItem(id)}>
        <Icon className="account-settings__menu-icon" />
        <span className="account-settings__menu-item-text">
          {itemData.name}
        </span>
      </div>
    );
  });
  return <>{tabsUI}</>;
}
MenuItems.propTypes = {
  item: PropTypes.string.isRequired,
  itemsOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectItem: PropTypes.func.isRequired
};

class AccountSettings extends React.PureComponent {
  static propTypes = {
    initialItem: PropTypes.oneOf(Object.keys(menuItemsData)),
    user: PropTypes.object,
    itemsOrder: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    initialItem: "profile",
    itemsOrder: ["profile", "lock", "email"]
  };

  constructor(props) {
    super(props);
    this.state = {
      item: props.initialItem
    };
  }

  selectItem = item => this.setState({ item });

  render() {
    const Component = menuItemsData[this.state.item].component;
    return (
      <ProjectPageChrome navLinks={navLinks} user={this.props.user}>
        <div className="account-settings">
          <div className="account-settings__header">
            <div className="account-settings__title">Account Settings</div>
            <div className="account-settings__subtitle">
              Manage and edit your profile, security, notifications, and billing
              settings.
            </div>
          </div>
          <div className="account-settings__panel">
            <div className="account-settings__menu">
              <MenuItems
                item={this.state.item}
                itemsOrder={this.props.itemsOrder}
                selectItem={this.selectItem}
              />
            </div>
            <LoaderContainer />
            <Component {...this.props} />
          </div>
        </div>
      </ProjectPageChrome>
    );
  }
}

const mapState = state => {
  return {
    ...state.network,
    ...state.completeAccount
  };
};

export default connect(mapState)(AccountSettings);
