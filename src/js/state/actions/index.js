import { createActions, URLS } from "./helpers";

export const general = {
  set: newState => ({
    type: "GENERAL_SET_STATE",
    newState
  }),
  update: newState => ({
    type: "GENERAL_UPDATE_STATE",
    newState
  })
};

export const tutorial = {
  set: newState => ({
    type: "TUTORIAL_SET_STATE",
    newState
  }),
  get: args => ({
    type: "FETCH_API_GET",
    url: `${URLS.base}${URLS.tutorial}`,
    branch: "tutorial",
    ...args
  }),
  post: args => ({
    type: "FETCH_API_POST",
    url: `${URLS.base}${URLS.tutorial}`,
    branch: "tutorial",
    ...args
  })
};

export const networking = {
  startFetching: () => ({
    type: "NETWORK_START_FETCH"
  }),
  stopFetching: () => ({
    type: "NETWORK_STOP_FETCH"
  }),
  fetchDashboard: (queryString = "") => ({
    type: "API_DASHBOARD",
    queryString
  }),
  fail: message => ({
    type: "NETWORK_FETCH_FAIL",
    message
  }),
  success: () => ({
    type: "NETWORK_FETCH_SUCCESS"
  }),
  results: (response, branch = "general") => ({
    type: "API_RESPONSE",
    response,
    branch
  })
};

export const createPassword = {
  set: newState => ({
    type: "CREATE_PASSWORD_SET_STATE",
    newState
  }),
  redirect: url => ({
    type: "CREATE_PASSWORD_REDIRECT",
    url
  })
};

export const completeAccount = {
  redirect: url => ({
    type: "COMPLETE_ACCOUNT_REDIRECT",
    url
  }),
  set: newState => ({
    type: "COMPLETE_ACCOUNT_SET_STATE",
    newState
  })
};

export const token = {
  update: x => ({
    type: "UPDATE_TOKEN",
    token: x
  })
};

export const event = {
  ga: x => ({
    type: "GA_EVENT",
    event: x
  })
};

export const pageMeta = {
  title: title => ({
    type: "UPDATE_PAGE_TITLE",
    title
  })
};

// api actions...

export const auth = {
  login: ({ email, password }) => ({
    type: "FETCH_API_POST",
    body: { email, password },
    branch: "token",
    url: `${URLS.base}${URLS.login}`
  }),
  logout: () => ({
    type: "LOGOUT"
  }),
  persistToken: token => ({
    type: "UPDATE_TOKEN",
    token
  }),
  clearToken: () => ({
    type: "UPDATE_TOKEN",
    token: {}
  })
};

export const nav = {
  updateLinks: navLinks => ({
    type: "UPDATE_NAVLINKS",
    navLinks
  }),
  updateHeaders: headerItems => ({
    type: "UPDATE_HEADER_ITEMS",
    headerItems
  })
};

export const user = createActions("user");
export const property_managers = createActions("property_managers");
export const portfolio = createActions("portfolio");
export const properties = createActions("properties");
export const funds = createActions("funds");
export const asset_managers = createActions("asset_managers");
export const kpi = createActions("kpi");
export const market = createActions("market");
export const project = createActions("project");
export const locations = createActions("locations");

export const inviteModal = {
  open: {
    type: "INVITE_MODAL_SHOW"
  },
  close: {
    type: "INVITE_MODAL_HIDE"
  },
  removeModalOpen: (property, member) => ({
    type: "INVITE_MODAL_REMOVE_MODAL_SHOW",
    property,
    member
  }),
  removeModalClose: {
    type: "INVITE_MODAL_REMOVE_MODAL_HIDE"
  },
  getUsers: (value, callback) => ({
    type: "API_INVITE_MODAL_GET_USERS",
    data: { value },
    callback
  }),
  removeMember: (project, member) => ({
    type: "API_INVITE_MODAL_REMOVE_MEMBER",
    data: { project, member }
  }),
  addMembers: (projects, members) => ({
    type: "API_INVITE_MODAL_ADD_MEMBER",
    data: { projects, members }
  }),
  resend: (hash, callback) => ({
    type: "API_INVITE_RESEND",
    hash,
    callback
  })
};

export const uiStrings = {
  fetch: (version, language) => ({
    type: "API_UI_STRINGS",
    data: { version, language }
  }),
  set: data => ({
    type: "UI_STRINGS_SET_STATE",
    data
  })
};
