import { createAjaxAction } from "./helpers";

const actions = {
  requestProject: createAjaxAction(
    "AJAX_GET_PROJECT_OVERALL",
    "/projects",
    projectId => `/${projectId}/overall/`
  ),
  requestReports: createAjaxAction(
    "AJAX_GET_PROJECT_REPORTS",
    "/projects",
    ({ projectId, reportType, reportSpan }) => {
      let qs = `/${projectId}/reports/?report_type=${reportType}`;
      if (reportSpan) {
        qs += `&report_span=${reportSpan}`;
      }
      return qs;
    }
  ),
  updateStore: payload => ({ type: "PROJECT_REPORTS_UPDATE_STORE", payload }),
  stopFetchingReports: () => ({ type: "STOP_FETCHING_PROJECT_REPORTS" })
};

export default actions;
