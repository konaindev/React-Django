export default {
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
