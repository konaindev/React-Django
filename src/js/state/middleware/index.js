import {
  general,
  tutorial,
  networking,
  createPassword,
  completeAccount,
  auth,
  locations,
  market,
  kpi,
  uiStrings,
  token as tokenActions
} from "../actions";
import { URLS } from "../actions/helpers";
import { axiosGet, axiosPost } from "../../utils/api";
import ReactGa from "react-ga";

export const fetchDashboard = store => next => action => {
  if (action.type === "API_DASHBOARD") {
    let x = store.getState();
    let { isFetching } = x.network;

    if (!isFetching || isFetching === false) {
      store.dispatch(networking.startFetching());
    }
    axiosGet(`${process.env.BASE_URL}/dashboard${action.queryString}`)
      .then(response => next(general.set(response.data)))
      .then(setTimeout(() => next(networking.stopFetching()), 120))
      .catch(e => {
        console.log("ERROR", e);
        next(networking.stopFetching());
      });
  } else {
    next(action);
  }
};

export const fetchCreatePassword = store => next => action => {
  if (action.type === "API_CREATE_PASSWORD") {
    const hash = action.hash;
    const url = `${process.env.BASE_URL}/users/create-password/${hash}`;
    if (action.data) {
      axiosPost(url, action.data)
        .then(response => {
          if (response.status === 200) {
            const redirectUrl = response.data.redirect_url || "/";
            next(createPassword.redirect(redirectUrl));
          } else {
            throw response;
          }
        })
        .catch(e => console.log("-----> ERROR", e));
    } else {
      const url = `${process.env.BASE_URL}/create-password/${hash}"`;
      axiosGet(url)
        .then(response => {
          next(createPassword.set(response.data));
        })
        .catch(e => console.log("-----> ERROR", e));
    }
  } else {
    next(action);
  }
};

export const fetchCompany = store => next => action => {
  switch (action.type) {
    case "API_COMPANY_ADDRESS": {
      const url = `${process.env.BASE_URL}/crm/office-address/`;
      axiosPost(url, action.data)
        .then(response => {
          const companyAddresses = response.data?.addresses || [];
          if (action.callback) {
            action.callback(companyAddresses);
          } else {
            next(completeAccount.set({ companyAddresses }));
          }
        })
        .catch(e => console.log("-----> ERROR", e));
      break;
    }
    case "API_COMPANY_SEARCH": {
      const url = `${process.env.BASE_URL}/crm/company-search/`;
      axiosPost(url, action.data)
        .then(response => {
          action.callback(response.data?.company || []);
        })
        .catch(e => console.log("-----> ERROR", e));
      break;
    }
    default:
      next(action);
  }
};

export const fetchCompleteAccount = store => next => action => {
  if (action.type === "API_COMPLETE_ACCOUNT") {
    const url = `${process.env.BASE_URL}/users/complete-account/`;
    if (action.data) {
      axiosPost(url, action.data)
        .then(response => {
          if (response.status === 200) {
            next(completeAccount.redirect("/"));
          } else {
            throw response;
          }
        })
        .catch(e => console.log("-----> ERROR", e));
    } else {
      axiosGet(url)
        .then(response => {
          next(completeAccount.set(response.data));
        })
        .catch(e => console.log("-----> ERROR", e));
    }
  } else {
    next(action);
  }
};

export const sendGaEvent = _ => next => action => {
  switch (action.type) {
    case "GA_EVENT": {
      ReactGa.event(action.event);
      break;
    }
    default:
      next(action);
  }
};

export const startNetworkFetch = _ => next => action => {
  switch (action.type) {
    case "NETWORK_START_FETCH":
      switch (action.branch) {
        case "dashboard":
          next(general.startFetching());
          break;
        default:
          next(action);
          break;
      }
    default:
      next(action);
  }
};

export const applyApiResult = _ => next => action => {
  switch (action.type) {
    case "API_RESPONSE": {
      switch (action.branch) {
        case "kpi": {
          next(kpi.set(action.response));
          break;
        }
        case "market": {
          next(market.set(action.response));
          break;
        }
        case "location": {
          next(locations.set(action.response));
          break;
        }
        case "dashboard": {
          //next(locations.set(action.reponse.locations));
          next(general.update(action.response));
          break;
        }
        case "token": {
          next(auth.persistToken(action.response));
          break;
        }
        default:
          next(action); // <-- pass this on if we didn't find a branch
          break;
      }
      break;
    }
    default:
      next(action);
  }
};

export const logoutMiddleware = store => next => action => {
  if (action.type === "LOGOUT") {
    next(auth.clearToken());
  } else {
    next(action);
  }
};

export const fetchInviteModal = store => next => action => {
  if (action.type === "API_INVITE_MODAL_GET_USERS") {
    const url = `${process.env.BASE_URL}/projects/members/`;
    axiosPost(url, action.data)
      .then(response => {
        const members = response.data?.members || [];
        action.callback(members);
      })
      .catch(e => console.log("-----> ERROR", e));
  } else if (action.type === "API_INVITE_MODAL_REMOVE_MEMBER") {
    const projectsId = action.data.project.property_id;
    const url = `${process.env.BASE_URL}/projects/${projectsId}/remove-member/`;
    axiosPost(url, action.data)
      .then(response => {
        const property = response.data.project;
        next({ type: "GENERAL_REMOVE_MEMBER_COMPLETE", property });
      })
      .catch(e => console.log("-----> ERROR", e));
  } else if (action.type === "API_INVITE_MODAL_ADD_MEMBER") {
    const url = `${process.env.BASE_URL}/projects/add-members/`;
    axiosPost(url, action.data)
      .then(response => {
        const properties = response.data.projects;
        next({ type: "GENERAL_INVITE_MEMBER_COMPLETE", properties });
      })
      .catch(e => console.log("-----> ERROR", e));
  } else if (action.type === "API_INVITE_RESEND") {
    const url = `${process.env.BASE_URL}/users/${action.hash}/resend-invite/`;
    axiosGet(url)
      .then(response => {
        if (response.status === 200) {
          action.callback(response.data);
        } else {
          throw response;
        }
      })
      .catch(e => console.log("-----> ERROR", e));
  } else {
    next(action);
  }
};

export const fetchUIString = store => next => action => {
  if (action.type === "API_UI_STRINGS") {
    const url = `${URLS.base}${URLS.ver}/localization`;
    axiosPost(url, action.data)
      .then(response => {
        if (response.status === 200) {
          next(uiStrings.set(response.data.data));
        } else if (response.status === 208) {
          next(action);
        } else {
          throw response;
        }
      })
      .catch(e => console.log("-----> ERROR", e));
  } else {
    next(action);
  }
};

export const refreshToken = store => next => action => {
  if (action.type === "REFRESH_TOKEN") {
    const { token } = store.getState();
    const { refresh } = token;
    axiosPost(action.url, { refresh })
      .then(response => {
        if (response.status === 401) {
          console.log("EXPIRED SESSION TOKENS, LOGGING OUT...");
          next(auth.clearToken());
        } else {
          next(tokenActions.update({ refresh, access: response.data.access }));
        }
      })
      .catch(e => console.log("REFRESH TOKEN ERROR", e));
  } else {
    next(action);
  }
};
