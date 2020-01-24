import { createAjaxAction } from "./helpers";

const actions = {
  requestPerformanceInsights: createAjaxAction(
    "AJAX_GET_PERFORMANCE_INSIGHTS",
    "/insights",
    ({ projectId }) => `/${projectId}/`
  )
};

export default actions;
