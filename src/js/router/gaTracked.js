import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import ReactGA from "react-ga";

// https://github.com/react-ga/react-ga/issues/122#issuecomment-526944210
const TrackedRoute = props => {
  useEffect(() => {
    const page = props.location.pathname;
    ReactGA.set({ page });
    ReactGA.pageview(page);

    // lets track the page in segment...
    // note that we don't care if a valid
    // key was supplied to the sdk...
    window.analytics.page(page);
  }, [props.location.pathname]);

  return <Route {...props} />;
};

export { TrackedRoute };
