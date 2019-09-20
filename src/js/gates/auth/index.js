import React from "react";
import { connect } from "react-redux";
import AuthContainer from "../../containers/auth";
import { TrackedRoute as Route } from "../../router/gaTracked";

class AuthGate extends React.PureComponent {
  componentDidMount() {
    console.log("auth gate", this.props);
  }
  render() {
    const _component =
      this.props.token && this.props.token.access ? (
        this.props.children
      ) : (
        <AuthContainer />
      );
    console.log("AuthGate render".this);
    return _component;
  }
}

const mapState = ({ token }) => ({ token });

export default connect(mapState)(AuthGate);
