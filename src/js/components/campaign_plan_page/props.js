import { project, report_links } from "../project_page/props";
import report from "../campaign_plan/campaign_plan.props";

const current_report_link = report_links.market;
const share_info = {
  shared: false,
  share_url: `/projects/${project.public_id}/share/campaign_plan/`,
  update_action: "shared_reports"
};

export default {
  project,
  report,
  report_links,
  current_report_link,
  share_info
};
