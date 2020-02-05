import _isObject from "lodash/isObject";

import {
  createPassword,
  completeAccount,
  uiStrings,
  accountSettings,
  auth,
  locations,
  market,
  kpi,
  token as tokenActions,
  networking,
  createFEUrl
} from "../actions";
import {
  getPropertiesData,
  updateCompanyData,
  updateOfficeData,
  updateUserProfileData,
  updateReportsSettingsData,
  updateSecurityData
} from "../../api/account_settings";
import { API_URL_PREFIX, URLS, createAPIUrl } from "../actions/helpers";
import { axiosGet, axiosPost } from "../../utils/api";
import { qsStringify } from "../../utils/misc";
import ReactGa from "react-ga";

// Here we create a middleware that intercepts
// actions representing a request for data from
// the api

function startFetchingState(store) {
  let x = store.getState();
  let { isFetching } = x.network;
  if (!isFetching || isFetching === false) {
    store.dispatch(networking.startFetching());
  }
}

export const fetchDashboard = store => next => action => {
  if (action.type === "API_DASHBOARD") {
    let x = store.getState();
    let { isFetching } = x.network;

    if (!isFetching || isFetching === false) {
      store.dispatch(networking.startFetching());
    }
    axiosGet(`${URLS.base}/dashboard${action.queryString}`)
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

export const fetchTutorial = store => next => action => {
  if (action.type === "API_TUTORIAL") {
    const url = `${URLS.base}/tutorial`;
    if (action.data) {
      axiosPost(url, action.data)
        .then(response => {
          next(tutorial.set(response.data));
        })
        .catch(e => console.log("-----> ERROR", e));
    } else {
      axiosGet(url)
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
    const url = createAPIUrl(`/users/create-password/`);
    if (action.data) {
      action.data.user_id = hash;
      axiosPost(url, action.data)
        .then(response => {
          if (response.status === 200) {
            const email = response.data.email;
            const password = action.data.password;
            const redirect_url = createFEUrl("/users/complete-account");
            next(auth.login({ email, password, redirect_url }));
          } else {
            throw response;
          }
        })
        .catch(e => console.log("-----> ERROR", e));
    } else {
      const url = createAPIUrl(`/create-password/`);
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

export const fetchPasswordRules = store => next => action => {
  if (action.type == "CREATE_PASSWORD_FETCH_RULES") {
    axiosGet(createAPIUrl("/users/password-rules/"))
      .then(response => {
        const rules = response.data?.rules || [];
        next(createPassword.set({ rules }));
      })
      .catch(e => console.log("-----> ERROR", e));
  } else {
    next(action);
  }
};

export const fetchCompany = store => next => action => {
  switch (action.type) {
    case "API_COMPANY_ADDRESS": {
      const url = `${API_URL_PREFIX}/crm/office-address/`;
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
      const url = `${API_URL_PREFIX}/crm/company-search/`;
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
    const url = `${API_URL_PREFIX}/users/complete-account/`;
    if (action.data) {
      startFetchingState(store);
      axiosPost(url, action.data)
        .then(response => {
          if (response.status === 200) {
            next(completeAccount.redirect("/"));
          } else {
            throw response;
          }
        })
        .catch(e => {
          if (e.response.data?.errors && _isObject(e.response.data?.errors)) {
            next(networking.stopFetching());
            action.onError(e.response.data.errors);
          } else {
            console.log("-----> ERROR", e);
            next(networking.stopFetching());
          }
        });
    } else {
      startFetchingState(store);
      axiosGet(url)
        .then(response => {
          next(completeAccount.set(response.data));
        })
        .then(() => next(networking.stopFetching()))
        .catch(e => {
          console.log("-----> ERROR", e);
          next(networking.stopFetching());
        });
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
    const url = createAPIUrl(`/search-members/`);
    axiosPost(url, action.data)
      .then(response => {
        const members = response.data?.members || [];
        action.callback(members);
      })
      .catch(e => console.log("-----> ERROR", e));
  } else if (action.type === "AJAX_DASHBOARD_REMOVE_MEMBER") {
    const projectsId = action.data.project.property_id;
    const url = createAPIUrl(`/projects/${projectsId}/remove-member/`);
    axiosPost(url, action.data)
      .then(response => {
        const property = response.data.project;
        next({ type: "AJAX_DASHBOARD_REMOVE_MEMBER_SUCCESS", property });
      })
      .catch(e => console.log("-----> ERROR", e));
  } else if (action.type === "API_INVITE_RESEND") {
    const url = createAPIUrl(`/users/${action.hash}/resend-invite/`);
    axiosGet(url)
      .then(response => {
        if (response.status === 200) {
          action.callback(response.data);
        } else {
          throw response;
        }
      })
      .catch(e => console.log("-----> ERROR", e));
  } else if (action.type === "API_INVITE_MODAL_CHANGE_ROLE") {
    const { role, property_id, member_id } = action.data;
    const data = { role };
    const url = createAPIUrl(`/projects/${property_id}/member/${member_id}/`);
    axiosPost(url, data).then(response => {
      if (response.status === 200) {
        next({
          type: "AJAX_DASHBOARD_UPDATE_MEMBER_SUCCESS",
          data: {
            property_id,
            members: response.data.members
          }
        });
      } else {
        throw response;
      }
    });
  } else {
    next(action);
  }
};

export const fetchUIString = store => next => action => {
  if (action.type === "API_UI_STRINGS") {
    const url = createAPIUrl(`/localization/${qsStringify(action.data)}`);
    axiosGet(url)
      .then(response => {
        if (response.status === 200) {
          next(uiStrings.set(response.data));
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

export const updateAccountSecurity = store => next => action => {
  if (action.type === "API_SECURITY_ACCOUNT") {
    if (action.data) {
      updateSecurityData(action.data)
        .then(response => {
          if (response.status === 200) {
            action.callback(response.data.message);
          } else {
            throw response;
          }
        })
        .catch(e => {
          if (e.response.data && _isObject(e.response.data)) {
            action.onError(e.response.data);
          } else {
            console.log("-----> ERROR", e);
          }
        });
    }
  } else {
    next(action);
  }
};

export const updateAccountProfile = store => next => action => {
  const accountApiMap = {
    API_ACCOUNT_PROFILE_USER: updateUserProfileData,
    API_ACCOUNT_PROFILE_COMPANY: updateCompanyData,
    API_ACCOUNT_PROFILE_OFFICE: updateOfficeData
  };
  const callApi = accountApiMap[action.type];
  if (callApi) {
    if (action.data) {
      startFetchingState(store);
      callApi(action.data)
        .then(response => {
          if (response.status === 200 && !response.data?.errors) {
            action.callback(response.data);
          } else {
            throw response;
          }
        })
        .then(() => next(networking.stopFetching()))
        .catch(e => {
          if (e.response.data?.errors && _isObject(e.response.data?.errors)) {
            next(networking.stopFetching());
            action.onError(e.response.data.errors);
          } else {
            console.log("-----> ERROR", e);
          }
          next(networking.stopFetching());
        });
    }
  } else {
    next(action);
  }
};

export const updateReportsSettings = store => next => action => {
  if (action.type === "API_ACCOUNT_REPORTS") {
    if (action.data) {
      updateReportsSettingsData(action.data)
        .then(response => {
          if (response.status === 200) {
            action.callback(response.data);
          } else {
            throw response;
          }
        })
        .catch(e => console.log("-----> ERROR", e));
    }
  } else {
    next(action);
  }
};

export const fetchAccountProperties = store => next => action => {
  if (action.type === "API_ACCOUNT_REPORT_PROPERTIES") {
    getPropertiesData(action.data)
      .then(response => {
        if (response.status === 200) {
          next(accountSettings.set(response.data));
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
          // there might be mutiple simulataneous calls which resulted 401
          // better to reload the page
          setTimeout(() => {
            window.location.reload();
          });
        }
      })
      .catch(e => console.log("REFRESH TOKEN ERROR", e));
  } else {
    next(action);
  }
};

export const login = store => next => action => {
  if (action.type == "LOGIN") {
    const apiUrl = createAPIUrl(URLS.login);
    axiosPost(apiUrl, action.body)
      .then(response => {
        console.log("LOGIN RESPONSE");
        console.log(response.status);
        if (response.status == 401) {
          console.log("BAD LOGIN");
          next(auth.loginError());
        } else {
          next(
            tokenActions.update({
              refresh: response.data.refresh,
              access: response.data.access
            })
          );

          // Edge needs a break to save token to localStorage using redux-persist
          // So that valid token is available after browser reload
          setTimeout(() => {
            console.log(`redirect url: ${action.redirect_url}`);
            if (action.redirect_url) {
              window.location.href = action.redirect_url;
            } else {
              window.location.reload();
            }
          });
        }
      })
      .catch(e => console.log("REFRESH TOKEN ERROR", e));
  } else if (action.type == "LOGIN_ERROR") {
    next(auth.clearToken());
  } else {
    next(action);
  }
};
