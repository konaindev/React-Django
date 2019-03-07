import React, { Component } from "react";
import PropTypes from "prop-types";

import ProjectDropDown from "../project_drop_down";
import ReportLinks from "../report_links";

import CommonReport from "../common_report";
import "./baseline_report_page.scss";

/**
 * @class Header
 *
 * @classdesc Render site-wide branded header, with pluggable nav items
 */
class Header extends Component {
  renderChildren() {
    const childCount = React.Children.count(this.props.children);

    // render nothing if we have no children
    if (childCount == 0) {
      return null;
    }

    // Nest children in nav wrappers
    const wrappedChildren = React.Children.map(this.props.children, child => (
      <li className="remarkably-header__item">{child}</li>
    ));

    // wrap children if we have them
    return (
      <nav className="remearkably-header__items-outer">
        <ul
          className="remarkably-header__items-inner"
          style={{ columns: childCount }}
        >
          {wrappedChildren}
        </ul>
      </nav>
    );
  }

  render() {
    return (
      <div className="remarkably-header-outer">
        <header className="remarkably-header-inner">
          {this.renderChildren()}
          <h2 className="remarkably-branding">
            Remarkably<span>&nbsp;™</span>
          </h2>
        </header>
      </div>
    );
  }
}

/**
 * @class Footer
 *
 * @classdesc Render site-wide generic footer content (copyright, etc)
 */
class Footer extends Component {
  render() {
    // For now, we render nothing, per spec.
    return <></>;
  }
}

/**
 * @class HeaderChrome
 *
 * @classdesc Container for all fixed-position chrome (header, tabs, etc)
 */
class TopChrome extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return <div className="top-chrome">{this.props.children}</div>;
  }
}

/**
 * @class BottomChrome
 *
 * @classdesc Container for all
 */
class BottomChrome extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return <>{this.props.children}</>;
  }
}

/**
 * @class Chrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages.
 */
class Chrome extends Component {
  static propTypes = {
    headerItems: PropTypes.node,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="chrome">
        <TopChrome>
          <Header>{this.props.headerItems}</Header>
          {this.props.topItems}
        </TopChrome>
        {this.props.children}
        <BottomChrome>
          <Footer />
        </BottomChrome>
      </div>
    );
  }
}

/**
 * @class ProjectChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages
 * that are related to a specific project.
 */
class ProjectChrome extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    const headerItems = <ProjectDropDown project={this.props.project} />;

    return (
      <Chrome headerItems={headerItems} topItems={this.props.topItems}>
        {this.props.children}
      </Chrome>
    );
  }
}

/**
 * @class ReportChrome
 *
 * @classdesc Render generic header/footer chrome for all Remarkably pages
 * that are related to a report for a specific project.
 */
class ReportChrome extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    current_report_name: PropTypes.string.isRequired,
    report_links: PropTypes.object.isRequired,
    topItems: PropTypes.node,
    children: PropTypes.node.isRequired
  };

  render() {
    const topItems = (
      <>
        <ReportLinks
          current_report_name={this.props.current_report_name}
          report_links={this.props.report_links}
        />
        {this.props.topItems}
      </>
    );

    return (
      <ProjectChrome project={this.props.project} topItems={topItems}>
        {this.props.children}
      </ProjectChrome>
    );
  }
}

/**
 * @description The full landing page for a single project report
 */
export default class BaselineReportPage extends Component {
  // TODO further define the shape of a report and a project...
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log("Report data", this.props.report);
  }

  render() {
    return (
      <ReportChrome
        project={this.props.project}
        current_report_name="baseline"
        report_links={this.props.report_links}
      >
        <CommonReport report={this.props.report} />
      </ReportChrome>
    );
  }
}
