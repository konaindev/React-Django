import { general, tutorial } from "../actions";
import { get, post } from "../../utils/api";
// Here we create a middleware that intercepts
// actions representing a request for data from
// the api
export const fetchDashboard = store => next => action => {
  if (action.type === "API_DASHBOARD") {
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
      .catch(e => console.log("-----> ERROR", e));
  } else {
    next(action);
  }
};

export const fetchTutorial = store => next => action => {
  if (action.type === "API_TUTORIAL") {
    const url = `${process.env.BASE_URL}/tutorial`;
    if (action.data) {
      post(url, action.data)
        .then(response => {
          next(tutorial.set(response.data));
        })
        .catch(e => console.log("-----> ERROR", e));
    } else {
      get(url)
        .then(response => {
          next(tutorial.set(response.data));
        })
        .catch(e => console.log("-----> ERROR", e));
    }
  } else {
    next(action);
  }
};
