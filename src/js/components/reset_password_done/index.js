import React from "react";
import Button from "../button";

import AccountForm from "../account_form";
import PageAuth from "../page_auth";

import "./reset_password_done.scss";

export default function ResetPasswordDone() {
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
          onClick={() => (window.location.href = "/users/password-reset")}
        >
          Re-send Link
        </Button>
      </AccountForm>
    </PageAuth>
  );
}
