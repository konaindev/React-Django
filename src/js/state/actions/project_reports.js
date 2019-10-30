import { createRequestTypes } from "./helpers";

export const PROJECT_OVERALL_GET = createRequestTypes("PROJECT_OVERALL_GET");
export const PROJECT_REPORTS_GET = createRequestTypes("PROJECT_REPORTS_GET");

export const projectOverallRequest = publicId => ({
  type: PROJECT_OVERALL_GET.REQUEST,
  publicId
});

export const projectReportsRequest = publicId => ({
  type: PROJECT_REPORTS_GET.REQUEST,
  publicId
});
