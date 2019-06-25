import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./top_navigation.scss";

export default class TopNavigation extends React.PureComponent {
  static propTypes = {
    links: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      }).isRequired
    ),
    selected_link: PropTypes.string.isRequired
  };

  renderLinks = () => {
    return this.props.links.map(link => {
      const className = cn("top-navigation__link", {
        "top-navigation__link--active": link.id === this.props.selected_link
      });
      return (
        <a className={className} href={link.url} key={link.id}>
          {link.name}
        </a>
      );
    });
  };

  render() {
    return <div className="top-navigation">{this.renderLinks()}</div>;
  }
}
