import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageChrome from "../../components/page_chrome";
import UserMenu from "../../components/user_menu";

class NavGate extends React.PureComponent {
  render() {
    const { navLinks, children } = this.props;
    return (
      <PageChrome
        navLinks={navLinks}
        headerItems={this.props.user ? <UserMenu {...this.props.user} /> : null}
      >
        {children}
      </PageChrome>
    );
  }
}

const mapState = state => {
  return {
    navLinks: state.nav.navLinks,
    headerItems: state.nav.headerItems,
    user: state.user
  };
};

export default withRouter(connect(mapState)(NavGate));
