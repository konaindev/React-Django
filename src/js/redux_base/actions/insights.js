import { createAjaxAction } from "./helpers";

const actions = {
  requestPerformanceInsights: createAjaxAction(
    "AJAX_GET_PERFORMANCE_INSIGHTS",
    "/insights",
    ({ projectId }) => `/${projectId}/`
  ),
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
