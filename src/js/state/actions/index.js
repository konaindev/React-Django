export const general = {
  set: newState => ({
    type: "GENERAL_SET_STATE",
    newState
  }),
  update: {
    type: "GENERAL_UPDATE_STATE"
  }
};

export const tutorial = {
  set: newState => ({
    type: "TUTORIAL_SET_STATE",
    newState
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

const URLS = {
  base: process.env.BASE_URL || "http//localhost:8000",
  login: "/api/token/",
  refresh: "/api/token/refresh/",
  portfolio: "/portfolio",
  locations: "/locations",
  asset_managers: "/asset_managers",
  market: "/market",
  kpi: "/kpi",
  project: "/projects"
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

export const user = {
  set: x => ({ type: "UPDATE_USER", x })
};

export const properties = {
  set: x => ({ type: "UPDATE_PROPERTIES", x })
};

export const funds = {
  set: x => ({ type: "UPDATE_FUNDS", x })
};

export const property_managers = {
  set: x => ({ type: "UPDATE_PROPERTY_MANAGERS", x })
};

export const portfolio = {
  set: x => ({ type: "UPDATE_PORTFOLIO", x }),
  fetch: args => ({
    type: "FETCH_API_GET",
    branch: "portfolio",
    url: `${URLS.base}${URLS.portfolio}`,
    ...args
  })
};

export const asset_managers = {
  set: x => ({ type: "UPDATE_ASSET_MANAGERS", x }),
  fetch: args => ({
    type: "FETCH_API_GET",
    branch: "asset_managers",
    url: `${URLS.base}${URLS.asset_managers}`,
    ...args
  })
};

export const locations = {
  set: x => ({ type: "UPDATE_LOCATIONS", x }),
  fetch: args => ({
    type: "FETCH_API_GET",
    branch: "locations",
    url: `${URLS.base}${URLS.locations}`,
    ...args
  })
};

export const project = {
  set: x => ({ type: "UPDATE_PROJECT", x }),
  merge: x => ({ type: "MERGE_INTO_PROJECT", x }),
  fetch: args => ({
    type: "FETCH_API_GET",
    branch: "project",
    url: `${URLS.base}${URLS.project}`,
    ...args
  })
};

export const market = {
  set: x => ({ type: "UPDATE_MARKET", x }),
  fetch: args => ({
    type: "FETCH_API_GET",
    branch: "market",
    url: `${URLS.base}${URLS.market}`,
    ...args
  })
};

export const kpi = {
  set: x => ({ type: "UPDATE_KPI", x }),
  fetch: args => ({
    type: "FETCH_API_GET",
    branch: "kpi",
    url: `${URLS.base}${URLS.kpi}`,
    ...args
  })
};
