import React from "react";
import { BrowserRouter as Router, Switch, Link } from "react-router-dom";
import ProjectsContainer from "../containers/projects";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";
import { TrackedRoute as Route } from "./gaTracked";

export function RemarkableRouter() {
  return (
    <Router>
      <Link to="/dashboard">test</Link>
      <Switch>
        <Route path="/" exact component={DashboardContainer} />
        <Route path="/dashboard" component={DashboardContainer} />
        <Route path="/projects" component={ProjectsContainer} />
        <Route path="/portfolio" component={PortfolioContainer} />
        <Route component={DashboardContainer} />
      </Switch>
    </Router>
  );
}
