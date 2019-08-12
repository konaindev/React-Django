import { general, networking } from "../actions";
// Here we create a middleware that intercepts
// actions representing a request for data from
// the api
export const fetchDashboard = store => next => action => {
  if (action.type === "API_DASHBOARD") {
    let x = store.getState();
    let { isFetching } = x.network;

    if (!isFetching || isFetching === false) {
      store.dispatch(networking.startFetching());
    }
    window
      .fetch(`${process.env.BASE_URL}/dashboard?${action.searchString}`, {
        responseType: "json",
        credentials: "include",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(x => x.json())
      .then(newState => next(general.set(newState)))
      .then(setTimeout(() => next(networking.stopFetching()), 120))
      .catch(e => {
        console.log("ERROR", e);
        next(networking.stopFetching());
      });
  } else {
    next(action);
  }
};
