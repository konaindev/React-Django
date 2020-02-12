import React from "react";
import Button from "../button";
import { connect } from "react-redux";

import AccountForm from "../account_form";
import PageAuth from "../page_auth";

import "./reset_password_done.scss";

export class ResetPasswordDone extends React.Component {
  resendResetPassword = () => {
    let email = this.props.resendEmail;
    this.props.dispatch({
      type: "SEND_PASSWORD_RESET_EMAIL",
      data: {
        email: email
      }
    });
  };
  render() {
    return (
      <PageAuth backLink="/">
        <AccountForm
          className="reset-password"
          title="Check your inbox"
          subtitle="We've sent you a special link to set your password."
        >
          <Button
            className="reset-password__button"
            color="primary"
            fullWidth={true}
            uppercase={true}
            onClick={this.resendResetPassword}
          >
            Re-send Link
          </Button>
        </AccountForm>
      </PageAuth>
    );
  }
}

const mapState = state => {
  return {
    resendEmail: state.resendEmail
  };
};

export default connect(mapState)(ResetPasswordDone);
