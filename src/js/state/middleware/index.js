import { general } from "../actions";
// Here we create a middleware that intercepts
// actions representing a request for data from
// the api
export const fetchDashboard = store => next => action => {
  if (action.type === "API_DASHBOARD") {
    window
      .fetch(`${BASE_URL}/dashboard?${action.searchString}`, {
        responseType: "json",
        credentials: "include",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(x => x.json())
      .then(newState => next(general.set(newState)))
      .catch(e => console.log("-----> ERROR", e));
  }
};
