import React from "react";
import LoginView from "../../components/login";
import renderWrapper from "../shared/base_container";

class AuthContainer extends React.Component {
  render() {
    return renderWrapper(<LoginView />, false, false);
  }
}

export default AuthContainer;
