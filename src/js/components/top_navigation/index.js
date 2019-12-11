import React from "react";
import { NavLink } from "react-router-dom";
import "./top_navigation.scss";

const navLinks = [
  {
    id: "properties",
    name: "Properties",
    url: "/dashboard"
  },
  {
    id: "portfolio-analysis",
    name: "Portfolio Analysis",
    url: "/portfolio/table"
  }
];

export default class TopNavigation extends React.PureComponent {
  renderLinks = () => {
    return navLinks.map(link => {
      return (
        <NavLink
          className="top-navigation__link"
          activeClassName="top-navigation__link--active"
          to={link.url}
          key={link.id}
        >
          {link.name}
        </NavLink>
      );
    });
  };

  render() {
    return <div className="top-navigation">{this.renderLinks()}</div>;
  }
}
