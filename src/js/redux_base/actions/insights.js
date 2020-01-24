import { createAjaxAction } from "./helpers";

const actions = {
  requestBaselineInsights: createAjaxAction(
    "AJAX_GET_BASELINE_INSIGHTS",
    "/insights",
    ({ projectId }) => `${projectId}/baseline/`
  ),
  resetState: () => ({
    type: "RESET_INSIGHTS_STATE"
  })
};

export default actions;
