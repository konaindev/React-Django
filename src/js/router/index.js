import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import ProjectsContainer from "../containers/projects";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";
import AuthContainer from "../containers/auth";
import { TrackedRoute as Route } from "./gaTracked";
import AuthGate from "../gates/auth";
import NavGate from "../gates/nav";

export function RemarkableRouter() {
  return (
    <Router>
      <AuthGate>
        <NavGate>
          <Switch>
            <Route path="/dashboard" component={DashboardContainer} />
            <Route path="/projects/:slug/" component={ProjectsContainer} />
            <Route exact path="/portfolio" component={PortfolioContainer} />
            <Route path="/portfolio/table" component={PortfolioContainer} />
            <Route path="/auth" component={AuthContainer} />
            {/* default to dashboard...since AuthGate takes care of no-auth */}
            <Redirect to="/dashboard" />
          </Switch>
        </NavGate>
      </AuthGate>
    </Router>
  );
}
