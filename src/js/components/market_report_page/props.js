import { project, report_links, user } from "../project_page/props";
import report from "../total_addressable_market/MarketAnalysis.js";

const current_report_link = report_links.market;
const share_info = {
  shared: false,
  share_url: `/projects/${project.public_id}/share/market/`
};

export default {
  user,
  project,
  report,
  report_links,
  current_report_link,
  share_info
};
