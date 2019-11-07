import { createAjaxAction } from "./helpers";

const actions = {
  requestProperties: createAjaxAction(
    "AJAX_DASHBOARD_PROPERTIES",
    "GET",
    "/dashboard",
    qs => qs
  ),
  updateStore: payload => ({
    type: "DASHBOARD_UPDATE_STORE",
    payload
  })
};

export default actions;
