import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../button";
import PageAuth from "../page_auth";
import { inviteModal } from "../../state/actions";

import "./session_expired_page.scss";

class SessionExpiredPage extends React.PureComponent {
  static propTypes = {
    hash: PropTypes.string.isRequired
  };

  state = {
    page: "form"
  };

  onClickHandler = () => {
    this.props.dispatch(
      inviteModal.resend(this.props.hash, () => {
        this.setState({ page: "confirm" });
      })
    );
  };

  confirm = (
    <div className="session-expired">
      <div className="session-expired__title">Email Sent!</div>
      <div className="session-expired__text">
        Please check your inbox for account setup email.
      </div>
    </div>
  );

  form = (
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
  );

  render() {
    return (
      <PageAuth backLink="/" bodyAlign="top">
        {this.state.page === "form" ? this.form : this.confirm}
      </PageAuth>
    );
  }
}

export default connect(x => x)(SessionExpiredPage);
