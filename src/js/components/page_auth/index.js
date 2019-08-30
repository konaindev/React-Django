import React from "react";
import PropTypes from "prop-types";

import RemarkablyLogo from "../remarkably_logo";

import "./page_auth.scss";

/**
 * @class PageAuth
 *
 * @classdesc Render generic header/footer chrome for all Remarkably auth pages.
 */
export default class PageAuth extends React.PureComponent {
  static propTypes = {
    backLink: PropTypes.string,
    backLinkText: PropTypes.string,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    backLinkText: "← Go to Login"
  };

  get backLink() {
    if (!this.props.backLink) {
      return null;
    }
    return (
      <a className="page-auth__back-link" href={this.props.backLink}>
        {this.props.backLinkText}
      </a>
    );
  }

  render() {
    return (
      <div className="page-auth">
        <div className="page-auth__header">
          {this.backLink}
          <div className="page-auth__logo">
            <RemarkablyLogo />
          </div>
        </div>
        <div className="page-auth__body">{this.props.children}</div>
        <div className="page-auth__footer">
          © 2019 Remarkably. All Rights Reserved
        </div>
      </div>
    );
  }
}