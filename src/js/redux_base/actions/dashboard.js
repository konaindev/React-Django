import { createAjaxAction } from "./helpers";

const actions = {
  requestProperties: createAjaxAction(
    "AJAX_GET_DASHBOARD_PROPERTIES",
    "/dashboard/",
    qs => qs
  ),
  updateStore: payload => ({
    type: "DASHBOARD_UPDATE_STORE",
    payload
  })
};

export default actions;
