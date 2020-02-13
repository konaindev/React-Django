import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import CompleteAccountView from "../components/complete_account_view";
import AccountSettingsContainer from "../containers/account_settings";
import ProjectReportsContainer from "../containers/project_reports";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";
import AuthContainer from "../containers/auth";
import CreatePasswordContainer from "../containers/create_password";
import ErrorContainer from "../containers/error";
import { TrackedRoute as Route } from "./gaTracked";
import ResetPasswordForm from "../components/reset_password_form";
import ResetPasswordDone from "../components/reset_password_done";
import ResetPasswordSuccess from "../components/reset_password_success";
import CreatePasswordView from "../components/create_password_view";

export function RemarkableRouter() {
  return (
    <Router>
      <Switch>
        <Route
          path="/users/create-password/:hash"
          component={CreatePasswordContainer}
        />
        <Route path="/users/reset/:uid/:token" component={CreatePasswordView} />
        <Route path="/users/password-reset/" component={ResetPasswordForm} />
        <Route path="/users/password-resend/" component={ResetPasswordDone} />
        <Route
          path="/users/password-success/"
          component={ResetPasswordSuccess}
        />
        <Route path="/users/complete-account" component={CompleteAccountView} />
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
