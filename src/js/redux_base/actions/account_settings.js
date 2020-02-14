import { createAjaxAction } from "./helpers";

export default {
  requestSettings: createAjaxAction(
    "AJAX_GET_ACCOUNT_SETTINGS",
    "/account-settings"
  ),
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
  }),
  postUserData: (data, callback, onError) => ({
    type: "API_ACCOUNT_PROFILE_USER",
    data,
    callback,
    onError
  }),
  postOfficeData: (data, callback, onError) => ({
    type: "API_ACCOUNT_PROFILE_OFFICE",
    data,
    callback,
    onError
  }),
  postCompanyData: (data, callback, onError) => ({
    type: "API_ACCOUNT_PROFILE_COMPANY",
    data,
    callback,
    onError
  })
};
