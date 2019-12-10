import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import { Web } from "../../icons";
import { stripURL } from "../../utils/misc";
import "./button_link.scss";

export default class ButtonLink extends React.PureComponent {
  static propTypes = {
    link: PropTypes.string.isRequired,
    target: PropTypes.string,
    className: PropTypes.string
  };
  static defaultProps = {
    target: "_blank"
  };

  render() {
    const { link, target, className, ...otherProps } = this.props;
    const classes = cn("button-link", className);
    return (
      <a className={classes} href={link} target={target} {...otherProps}>
        <Web className="button-link__icon" />
        {stripURL(link)}
      </a>
    );
  }
}
