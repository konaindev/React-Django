import { project, report_links } from "../project_page/props";
import { performanceReport } from "../common_report/props";
import { insights } from "../insights_report/props";

const emptyFun = () => {};

export const performanceProps = {
  project: { ...project, report_links },
  reportType: "performance",
  reportSpan: "last-four-weeks",
  historyPush: emptyFun,
  dispatch: emptyFun,
  share_info: null,
  report: performanceReport,
  fetchingReports: false,
  isAddTagInput: false,
  suggestedTags: [],
  insights
};
