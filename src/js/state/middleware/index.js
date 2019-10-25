import _isObject from "lodash/isObject";

import {
  general,
  tutorial,
  networking,
  createPassword,
  completeAccount,
  uiStrings,
  accountSettings
} from "../actions";
import {
  getPropertiesData,
  updateProfileData,
  updateReportsSettingsData,
  updateSecurityData
} from "../../api/account_settings";
import { axiosGet, axiosPost } from "../../utils/api";

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

export const fetchTutorial = store => next => action => {
  if (action.type === "API_TUTORIAL") {
    const url = `${process.env.BASE_URL}/tutorial`;
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
    const url = `${process.env.BASE_URL}/localization`;
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
  if (action.type === "API_ACCOUNT_PROFILE") {
    console.log(action);
    if (action.data) {
      startFetchingState(store);
      setTimeout(
        () =>
          updateProfileData(action.data)
            .then(response => {
              if (response.status === 200) {
                action.callback(response.data);
                console.log(action);
                console.log(response);
              } else {
                throw response;
              }
            })
            .then(() => next(networking.stopFetching()))
            .catch(e => {
              if (e.response?.data && _isObject(e.response.data)) {
                next(networking.stopFetching());
                action.onError(e.response.data);
              } else {
                console.log("-----> ERROR", e);
              }
              next(networking.stopFetching());
            }),
        5000
      );
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
