import React from "react";
import { BrowserRouter as Router, Switch, Link } from "react-router-dom";
import ProjectsContainer from "../containers/projects";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";
import AuthContainer from "../containers/auth";
import { TrackedRoute as Route } from "./gaTracked";
import AuthGate from "../gates/auth";

export function RemarkableRouter() {
  return (
    <Router>
      <Link to="/dashboard">test</Link>
      <AuthGate>
        <Switch>
          <Route path="/" exact component={DashboardContainer} />
          <Route path="/dashboard" component={DashboardContainer} />
          <Route path="/projects" component={ProjectsContainer} />
          <Route path="/portfolio" component={PortfolioContainer} />
          <Route path="/auth" component={AuthContainer} />
          <Route component={DashboardContainer} />
        </Switch>
      </AuthGate>
    </Router>
  );
}
