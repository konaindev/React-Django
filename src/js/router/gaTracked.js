import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import ReactGA from "react-ga";

// https://github.com/react-ga/react-ga/issues/122#issuecomment-526944210
const TrackedRoute = props => {
  useEffect(() => {
    const page = props.location.pathname;
    ReactGA.set({ page });
    ReactGA.pageview(page);
  }, [props.location.pathname]);

  return <Route {...props} />;
};

export { TrackedRoute };
