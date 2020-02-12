import React from "react";
import Button from "../button";

import AccountForm from "../account_form";
import PageAuth from "../page_auth";

import "./reset_password_success.scss";

export default function ResetPasswordSuccess() {
  return (
    <PageAuth backLink="/">
      <AccountForm
        className="reset-password-success"
        title="Password has been reset!"
        subtitle="Log into your account with your new password."
      >
        <Button
          className="goto-login__button"
          color="primary"
          fullWidth={true}
          uppercase={true}
          onClick={() => (window.location.href = "/")}
        >
          go to log in
        </Button>
      </AccountForm>
    </PageAuth>
  );
}
