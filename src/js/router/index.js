import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  HashRouter
} from "react-router-dom";
import ProjectsContainer from "../containers/projects";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";

export function RemarkableRouter() {
  return (
    <HashRouter>
      <Link to="/dashboard">test</Link>
      <Switch>
        <Route path="/" exact component={DashboardContainer} />
        <Route path="/dashboard" component={DashboardContainer} />
        <Route path="/projects" component={ProjectsContainer} />
        <Route path="/portfolio" component={PortfolioContainer} />
        <Route component={DashboardContainer} />
      </Switch>
    </HashRouter>
  );
}
