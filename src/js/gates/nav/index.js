import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageChrome from "../../components/page_chrome";
class NavGate extends React.PureComponent {
  render() {
    const { navLinks, children, headerItems } = this.props;
    return (
      <PageChrome navLinks={navLinks} headerItems={headerItems}>
        {children}
      </PageChrome>
    );
  }
}

const mapState = ({ navLinks, headerItems }) => ({
  navLinks,
  headerItems
});

export default withRouter(connect(mapState)(NavGate));
