import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { Email, Lock, Profile } from "../../icons";
import PageChrome from "../page_chrome";

import AccountSecurity from "./account_security";
import EmailReports from "./email_reports";
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

export default class AccountSettings extends React.PureComponent {
  static propTypes = {
    initialTab: PropTypes.string
  };

  static defaultProps = {
    initialTab: "profile"
  };

  tabsData = {
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
      name: "Email Reports",
      iconComponent: Email,
      component: EmailReports
    }
  };

  tabs = ["profile", "lock", "email"];

  constructor(props) {
    super(props);
    this.state = {
      tab: props.initialTab
    };
  }

  selectTab = tab => this.setState({ tab });

  getItems = () => {
    const { tab } = this.state;
    return this.tabs.map(id => {
      const item = this.tabsData[id];
      const Icon = item.iconComponent;
      const itemClass = cn("account-settings__menu-item", {
        "account-settings__menu-item--active": id === tab
      });
      return (
        <div className={itemClass} key={id} onClick={() => this.selectTab(id)}>
          <Icon />
          <span className="account-settings__menu-item-text">{item.name}</span>
        </div>
      );
    });
  };

  render() {
    const Component = this.tabsData[this.state.tab].component;
    return (
      <PageChrome navLinks={navLinks}>
        <div className="account-settings">
          <div className="account-settings__header">
            <div className="account-settings__title">Account Settings</div>
            <div className="account-settings__subtitle">
              Manage and edit your profile, security, notifications, and billing
              settings.
            </div>
          </div>
          <div className="account-settings__panel">
            <div className="account-settings__menu">{this.getItems()}</div>
            <Component {...this.props} />
          </div>
        </div>
      </PageChrome>
    );
  }
}
