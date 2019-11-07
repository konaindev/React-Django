import { createAjaxAction } from "./helpers";

const actions = {
  requestProject: createAjaxAction(
    "AJAX_PROJECT_OVERALL",
    "GET",
    "/projects",
    projectId => `/${projectId}/overall`
  ),
  requestReports: createAjaxAction(
    "AJAX_PROJECT_REPORTS",
    "GET",
    "/projects",
    ({ projectId, reportType, reportSpan }) => {
      let qs = `/${projectId}/reports/?report_type=${reportType}`;
      if (reportSpan) {
        qs += `&report_span=${reportSpan}`;
      }
      return qs;
    }
  ),
  updateStore: payload => ({
    type: "PROJECT_REPORTS_UPDATE_STORE",
    payload
  })
};

export default actions;
