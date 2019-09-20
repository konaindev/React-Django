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

export const auth = {
  login: ({ email, pwd }) => ({
    type: "LOGIN_START",
    email,
    pwd,
    branch: "token"
  }),
  logout: () => ({
    type: "LOGOUT_START"
  }),
  persistToken: token => ({
    type: "PERSIST_TOKEN",
    token
  })
};
