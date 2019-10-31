import { createRequestTypes } from "./helpers";

export const PROJECT_OVERALL_GET = createRequestTypes(
  "projectReports/PROJECT_OVERALL_GET"
);
export const PROJECT_REPORTS_GET = createRequestTypes(
  "projectReports/PROJECT_REPORTS_GET"
);

export const projectOverallRequest = publicId => ({
  type: PROJECT_OVERALL_GET.REQUEST,
  publicId
});

export const projectOverallSuccess = data => ({
  type: PROJECT_OVERALL_GET.SUCCESS,
  data
});

export const projectReportsRequest = (publicId, reportType, reportSpan) => ({
  type: PROJECT_REPORTS_GET.REQUEST,
  publicId,
  reportType,
  reportSpan
});

export const projectReportsSuccess = (data, reportType) => ({
  type: PROJECT_REPORTS_GET.SUCCESS,
  data,
  reportType
});
