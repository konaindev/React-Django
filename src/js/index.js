import React from "react";
import ReactDOM from "react-dom";

/**
 * Import our master CSS to force our bundler to build it
 */
import "css/main.scss";

/*
 * Import all pages here.
 *
 * Be sure to add your Page to the pages object.
 */
import BaselineReportPage from "./pages/BaselineReportPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import MarketReportPage from "./pages/MarketReportPage.js";
import ModelingReportPage from "./pages/ModelingReportPage.js";
import Page from "./pages/Page.js";
import PerformanceReportPage from "./pages/PerformanceReportPage.js";
import ProjectPage from "./pages/ProjectPage.js";

const pages = {
  BaselineReportPage,
  DashboardPage,
  MarketReportPage,
  ModelingReportPage,
  Page,
  PerformanceReportPage,
  ProjectPage
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

/*

/* Run our page. */
ready(() => {
  const pageClass = getPageClass();
  /* If this is a react rooted page, spin up the app. */
  if (pageClass) {
    const pageProps = getPageProps();
    renderApp(pageClass, pageProps);
  }
});
