export const general = {
  set: newState => ({
    type: "GENERAL_SET_STATE",
    newState
  }),
  update: {
    type: "GENERAL_UPDATE_STATE"
  }
};

export const networking = {
  startFetching: () => ({
    type: "NETWORK_START_FETCH"
  }),
  stopFetching: () => ({
    type: "NETWORK_STOP_FETCH"
  }),
  fetchDashboard: searchString => ({
    type: "API_DASHBOARD",
    searchString
  })
};
