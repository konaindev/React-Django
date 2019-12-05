import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import AccountSettingsContainer from "../containers/account_settings";
import ProjectReportsContainer from "../containers/project_reports";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";
import AuthContainer from "../containers/auth";
import CreatePasswordContainer from "../containers/create_password";
import ErrorContainer from "../containers/error";
import { TrackedRoute as Route } from "./gaTracked";


export function RemarkableRouter() {
  return (
    <Router>
      <Switch>
        <Route
          path="/users/create-password/:hash"
          component={CreatePasswordContainer}
        />
        <Route path="/dashboard" component={DashboardContainer} />
        <Route
          path="/projects/:projectId/:reportType/:reportSpan?"
          component={ProjectReportsContainer}
        />
        <Route path="/portfolio/table" component={PortfolioContainer} />
        <Redirect from="/portfolio" to="/portfolio/table" />
        <Route path="/auth" component={AuthContainer} />
        <Route path="/error" exact component={ErrorContainer} />
        <Route path="/account-settings" component={AccountSettingsContainer} />
        <Route path="/" component={DashboardContainer} />
        {/* default to dashboard...since AuthGate takes care of no-auth */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}
