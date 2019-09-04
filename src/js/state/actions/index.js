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

export const inviteModal = {
  open: {
    type: "INVITE_MODAL_SHOW"
  },
  close: {
    type: "INVITE_MODAL_HIDE"
  }
};
