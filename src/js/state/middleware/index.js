import {
  general,
  tutorial,
  networking,
  createPassword,
  completeAccount
} from "../actions";
import { axiosGet, axiosPost } from "../../utils/api";

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
    if (action.data) {
      const url = `${process.env.BASE_URL}/create-password/${hash}"`;
      const data = { password };
      axiosPost(url, action.data)
        .then(response => {
          if (response.status === 200) {
            next(createPassword.redirect("/users/complete-account/"));
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
  } else {
    next(action);
  }
};
