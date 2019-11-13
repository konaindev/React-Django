import { createAjaxAction } from "./helpers";

const actions = {
  requestGroups: createAjaxAction(
    "AJAX_GET_PORTFOLIO_GROUPS",
    "/portfolio/table/",
    qs => qs
  ),
  updateStore: payload => ({
    type: "PORTFOLIO_UPDATE_STORE",
    payload
  })
};

export default actions;
