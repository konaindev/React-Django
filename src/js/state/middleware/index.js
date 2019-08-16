import { general, tutorial, networking, createPassword } from "../actions";
import { get, post } from "../../utils/api";

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

export const fetchCreatePassword = store => next => action => {
  if (action.type === "API_CREATE_PASSWORD") {
    const hash = action.hash;
    if (action.data) {
      const url = `${process.env.BASE_URL}/create-password/${hash}"`;
      const data = { password };
      post(url, action.data)
        .then(response => {
          if (response.status === 200) {
            const redirectUrl = "/";
            next(createPassword.redirect(redirectUrl));
          } else {
            throw response;
          }
        })
        .catch(e => console.log("-----> ERROR", e));
    } else {
      const url = `${process.env.BASE_URL}/create-password/${hash}"`;
      get(url);
    }
  } else {
    next(action);
  }
};
