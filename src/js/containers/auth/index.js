import React from "react";
import { connect } from "react-redux";
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
    console.log(".......", this.props);
    this.props.dispatch({
      type: "FETCH_API_POST",
      url: "http://localhost:8000/api/token/",
      branch: "token",
      body: {
        email: "todd@remarkably.io",
        password: "test"
      }
    });
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
