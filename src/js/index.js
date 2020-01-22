import "core-js/shim"; // core-js@2
import "regenerator-runtime/runtime";
import "url-search-params-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
/**
 * Import our master CSS to force our bundler to build it
 */
import "css/main.scss";

/*
 * Import all pages here.
 *
 * Be sure to add your Page to the pages object.
 */
import AccountSettings from "./components/account_settings";
import DashboardPage from "./components/dashboard_page";
import ProjectPage from "./components/project_page";
import ReleaseNotesPage from "./components/release_notes_page";
import ReleaseNoteDetailsPage from "./components/release_note_details_page";
import PortfolioAnalysisView from "./components/portfolio_analysis_view";
import CreatePasswordView from "./components/create_password_view";
import CompleteAccountView from "./components/complete_account_view";
import SessionExpiredPage from "./components/session_expired_page";
import LoginView from "./components/login";
import ResetPasswordForm from "./components/reset_password_form";
import ResetPasswordDone from "./components/reset_password_done";

const pages = {
  AccountSettings,
  DashboardPage,
  ProjectPage,
  ReleaseNotesPage,
  ReleaseNoteDetailsPage,
  PortfolioAnalysisView,
  CompleteAccountView,
  CreatePasswordView,
  SessionExpiredPage,
  LoginView,
  ResetPasswordForm,
  ResetPasswordDone
};

/*
 * Import the root application here.
 */
import App from "./App.js";

/*
 * Import other utilities here.
 */
import { getGlobalData } from "./utils/globalData.js";

/**
 * @description Render our application at the document's "root"
 */
const renderApp = () => {
  const root = document.querySelector("#root");
  const app = React.createElement(App, {});

  ReactDOM.render(app, root);
};

/**
 * @description Determine the page class to render.
 *
 * Defaults to the generic Page component.
 */
const getPageClass = () => {
  // Determine the page class.
  const root = document.getElementById("root");
  if (!root) {
    return null;
  }
  const pageName = root ? root.dataset.page : null;
  const pageClass = pageName ? pages[pageName] : DashboardPage;
  return pageClass;
};

/**
 * @description Return all properties to use for the page component.
 */
const getPageProps = () => getGlobalData("page-props") || {};

/**
 * @description Fires callback exactly once, after the document is loaded.
 */
const ready = cb => {
  if (document.readyState != "loading") {
    cb();
    return;
  }

  const handleContentLoaded = () => {
    cb();
    document.removeEventListener("DOMContentLoaded", handleContentLoaded);
  };

  document.addEventListener("DOMContentLoaded", handleContentLoaded);
};

/* Run our page. */
ready(() => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
  });
  // detect what environment we are running in

  Sentry.configureScope(x => x.setTag("env", process.env.ENV || "local"));

  renderApp();
});
