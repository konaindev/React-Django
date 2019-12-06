import React from "react";
import { connect } from "react-redux";
import AuthContainer from "../../containers/auth";

class AuthWrapper extends React.PureComponent {
  render() {
    return this.props.token && this.props.token.access ? (
      this.props.children
    ) : (
      <AuthContainer />
    );
  }
}

const mapState = ({ token }) => ({ token });

export default connect(mapState)(AuthWrapper);
