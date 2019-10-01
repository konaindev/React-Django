import React from "react";

import Button from "../button";
import PageAuth from "../page_auth";

import "./session_expired.scss";

export default class SessionExpired extends React.PureComponent {
  onClickHandler = () => {
    // TODO: Add action for resend email;
  };

  render() {
    return (
      <PageAuth backLink="/" bodyAlign="top">
        <div className="session-expired">
          <div className="session-expired__title">Session Expired</div>
          <div className="session-expired__text">
            Please click below to resend account setup email.
          </div>
          <Button
            className="session-expired__button"
            color="primary"
            uppercase={true}
            fullWidth={true}
            onClick={this.onClickHandler}
          >
            Resend Email
          </Button>
        </div>
      </PageAuth>
    );
  }
}
