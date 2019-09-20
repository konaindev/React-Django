import React from "react";
import { connect } from "react-redux";
import { auth } from "../../state/actions";
import Button from "../../components/button";
class AuthContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  doLogin() {
    this.props.dispatch(
      auth.login({
        email: "todd@remarkably.io",
        password: "test"
      })
    );
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <Button color="primary" onClick={() => this.doLogin()} />
      </div>
    );
  }
}

export default connect(x => x)(AuthContainer);
