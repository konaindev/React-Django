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

    route("/create-password/*", async function(hash) {
      await callback(hash);
    });

    route("/..", async function() {
      // fire the callback
      await callback(window.location.search);
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
