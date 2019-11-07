import { createAjaxActions, URLS } from "./helpers";

const actions = {
  requestProperties: createAjaxActions(
    "AJAX_DASHBOARD_PROPERTIES",
    "GET",
    "/dashboard",
    (d = {}) => d.queryStringForAjax || ""
  ),
  updateStore: payload => ({
    type: "DASHBOARD_UPDATE_STORE",
    payload
  })
};

export default actions;
