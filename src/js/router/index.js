import route from "riot-route";
// NOTE: this has a LOT of kruft to remove...
const router = base => callback => {
  let active = false;

  const start = () => {
    route.start();
    active = true;
    return { active };
  };

  const stop = () => {
    route.stop();
    active = false;
    return { active };
  };

  const initRouter = ({ base, route }) => {
    route.base(base || "/dashboard");

    route("/..", async function() {
      const { search } = window.location;
      // fire the callback
      await callback(search);
    });
    // start the router and autoprocess the current url
    route.start(true);
    return route;
  };

  return {
    isActive: active,
    start,
    stop,
    route: initRouter({
      base,
      route
    })
  };
};

export default router;
