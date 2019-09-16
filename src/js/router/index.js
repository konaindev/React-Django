import React from "react";
import route from "riot-route";
import {
  BrowserRouter as Router,
  StaticRouter,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import ProjectsContainer from "../containers/projects";
import DashboardContainer from "../containers/dashboard";
import PortfolioContainer from "../containers/portfolio";

const PAGES = [
  {
    path: "/",
    component: DashboardContainer
  },
  {
    path: "/dashboard",
    component: DashboardContainer
  },
  {
    path: "/portfolio",
    component: PortfolioContainer
  },
  {
    path: "/projects",
    component: ProjectsContainer
  }
];

export function RemarkableRouter() {
  return (
    <Router>
      <Link to="/dashboard">test</Link>
      <StaticRouter basename="/projects">
        <Route component={NoMatch} />
      </StaticRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={DashboardContainer} />
        <Route path="/projects" component={ProjectsContainer} />
        <Route path="/portfolio" component={PortfolioContainer} />
        <Redirect to="/" />
        <Route path="/oops" component={NoMatch} />
      </Switch>
    </Router>
  );
}

function Home() {
  return (
    <p>
      A <code>&lt;Switch></code> renders the first child <code>&lt;Route></code>{" "}
      that matches. A <code>&lt;Route></code> with no <code>path</code> always
      matches.
    </p>
  );
}

function NoMatch({ location }) {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}
