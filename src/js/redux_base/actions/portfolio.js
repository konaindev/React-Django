import { createAjaxAction } from "./helpers";

const actions = {
  requestGroups: createAjaxAction(
    "AJAX_PORTFOLIO_GROUPS",
    "GET",
    "/portfolio/table/",
    qs => qs
  ),
  updateStore: payload => ({
    type: "PORTFOLIO_UPDATE_STORE",
    payload
  })
};

export default actions;
