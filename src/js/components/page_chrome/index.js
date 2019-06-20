import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import PageHeader from "../page_header";
import PageFooter from "../page_footer";

import "./page_chrome.scss";

/**
 * @class TopChrome
 *
 * @classdesc Container for all fixed-position chrome (header, tabs, etc)
 * Provides live sizing code to ensure that content that follows is properly spaced
 * so that it initially renders fully visible, unblocked by the fixed content.
 */
class TopChrome extends Component {
  static DEFAULT_TOP_AREA_HEIGHT = 76;

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.spacingRef = React.createRef();
    this.state = { topAreaHeight: 0 };
  }

  computeTopAreaHeight = () =>
    this.spacingRef.current?.offsetHeight || TopChrome.DEFAULT_TOP_AREA_HEIGHT;

  updateDimensions = () => {
    this.setState({ topAreaHeight: this.computeTopAreaHeight() });
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    return (
      <div className="page-chrome__top-chrome">
        {/* The fixed-position top content */}
        <div ref={this.spacingRef} className="page-chrome__top-chrome__content">
          {this.props.children}
        </div>
        {/* A spacing div that is part of normal CSS flow and ensures content will be seen */}
        <div
          className="page-chrome__top-chrome__spacing-fix"
          style={{ height: this.state.topAreaHeight }}
        >
          &nbsp;
        </div>
      </div>
    );
  }
}

/**
 * @class BottomChrome
 *
 * @classdesc Container for all bottom page chrome (footer, etc)
 */
class BottomChrome extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

/**
 * @class PageChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages.
 */
export default class PageChrome extends Component {
  static propTypes = {
    headerItems: PropTypes.node,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="chrome">
        <TopChrome>
          <PageHeader>{this.props.headerItems}</PageHeader>
          {this.props.topItems}
        </TopChrome>
        {this.props.children}
        <BottomChrome>
          <PageFooter />
        </BottomChrome>
      </div>
    );
  }
}
