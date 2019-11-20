import { createActions, URLS } from "./helpers";

export * from "./helpers";
export { default as dashboard } from "./dashboard";
export { default as portfolio } from "./portfolio";
export { default as projectReports } from "./project_reports";
export { default as inviteModal } from "./invite_modal";

export const tutorial = {
  set: newState => ({
    type: "TUTORIAL_SET_STATE",
    newState
  }),
  get: args => ({
    type: "FETCH_API_GET",
    url: `${URLS.base}${URLS.ver}${URLS.tutorial}`,
    branch: "tutorial",
    ...args
  }),
  post: args => ({
    type: "FETCH_API_POST",
    url: `${URLS.base}${URLS.ver}${URLS.tutorial}`,
    branch: "tutorial",
    ...args
  })
};

export const addressModal = {
  open: (data, addresses) => ({
    type: "ADDRESS_MODAL_SHOW",
    data,
    addresses
  }),
  close: {
    type: "ADDRESS_MODAL_HIDE"
  }
};

export const networking = {
  startFetching: branch => ({
    type: "NETWORK_START_FETCH",
    branch
  }),
  stopFetching: () => ({
    type: "NETWORK_STOP_FETCH"
  }),
  fail: message => ({
    type: "NETWORK_FETCH_FAIL",
    message
  }),
  success: () => ({
    type: "NETWORK_FETCH_SUCCESS"
  }),
  results: (response, branch) => ({
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
  }),
  refresh: failedAction => ({
    type: "REFRESH_TOKEN",
    url: `${URLS.base}${URLS.ver}${URLS.refresh}`,
    failedAction
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
    url: `${URLS.base}${URLS.ver}${URLS.login}`
  }),
  logout: () => ({
    type: "LOGOUT"
  }),
  persistToken: token => ({
    type: "UPDATE_TOKEN",
    token
  }),
  clearToken: () => ({
    type: "CLEAR_TOKEN"
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
export const properties = createActions("properties");
export const funds = createActions("funds");
export const asset_managers = createActions("asset_managers");
export const kpi = createActions("kpi");
export const market = createActions("market");
export const project = createActions("project");
export const locations = createActions("locations");

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

export const accountSettings = {
  getProperties: data => ({
    type: "API_ACCOUNT_REPORT_PROPERTIES",
    data
  }),
  set: data => ({
    type: "SET_ACCOUNT_REPORTS_PROPERTIES",
    data
  }),
  clear: data => ({
    type: "CLEAR_ACCOUNT_REPORTS_PROPERTIES",
    data
  })
};
