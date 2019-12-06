import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageChrome from "../../components/page_chrome";
import UserMenu from "../../components/user_menu";

class NavWrapper extends React.PureComponent {
  render() {
    const { navLinks, children } = this.props;
    return (
      <PageChrome
        navLinks={navLinks}
        headerItems={
          this.props.user ? (
            <UserMenu {...this.props.user} logout_url="" />
          ) : null
        }
      >
        {children}
      </PageChrome>
    );
  }
}

const mapState = state => {
  return {
    navLinks: state.nav.navLinks,
    // note: this is ugly and should go...
    user: state.dashboard.user || state.user
  };
};

export default withRouter(connect(mapState)(NavWrapper));
