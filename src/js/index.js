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
import BaselineReportPage from "./components/baseline_report_page";
import DashboardPage from "./components/dashboard_page";
import MarketReportPage from "./components/market_report_page";
import ModelingReportPage from "./components/modeling_report_page";
import PerformanceReportPage from "./components/performance_report_page";
import ProjectPage from "./components/project_page";
import ReleaseNotesPage from "./components/release_notes_page";
import ReleaseNoteDetailsPage from "./components/release_note_details_page";
import CampaignPlanPage from "./components/campaign_plan_page";
import store from "./state/store";
import { general } from "./state/actions";
import PortfolioAnalysisView from "./components/portfolio_analysis_view";

const pages = {
  BaselineReportPage,
  DashboardPage,
  MarketReportPage,
  ModelingReportPage,
  PerformanceReportPage,
  ProjectPage,
  ReleaseNotesPage,
  ReleaseNoteDetailsPage,
  CampaignPlanPage,
  PortfolioAnalysisView
};

const tmpFetchDashboardData = pageClass => {
  const location = window.location;
  const queryString = location.search;
  let _newState = {};
  window
    .fetch(
      `${process.env.BASE_URL}/dashboard${
        queryString ? `?${queryString}` : ""
      }`,
      {
        responseType: "json",
        credentials: "include",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(x => x.json())
    .then(newState => {
      store.dispatch(general.set(newState));
      _newState = newState;
    })
    .catch(e => console.log(e))
    .finally(() => {
      renderApp(pageClass, _newState);
    });
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
const renderApp = (pageClass, pageProps) => {
  const root = document.querySelector("#root");
  const page = React.createElement(pageClass, pageProps);
  const app = React.createElement(App, {}, page);

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
  const pageClass = pageName ? pages[pageName] : Page;
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
    dsn: process.env.SENTRY_URL
  });
  // detect what environment we are running in

  Sentry.configureScope(x => x.setTag("env", process.env.ENV || "local"));

  const pageClass = getPageClass();

  /* If this is a react rooted page, spin up the app. */
  if (pageClass) {
    if (root && root.dataset.page === "DashboardPage") {
      tmpFetchDashboardData(pageClass);
    } else {
      store.dispatch(general.set(getPageProps()));
      renderApp(pageClass, getPageProps());
    }
  }
});
