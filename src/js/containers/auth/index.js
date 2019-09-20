import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
class AuthContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  componentDidMount() {
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
  render() {
    return (
      <div>
        <button color="primary" />
      </div>
    );
  }
}

export default withRouter(connect(x => x)(AuthContainer));
