import { props as report } from "../modeling_view/props.js";
import { project, report_links, user } from "../project_page/props";

const current_report_link = report_links.modeling;
const share_info = {
  shared: false,
  share_url: `/projects/${project.public_id}/share/modeling/`
};

export default {
  user,
  project,
  report,
  report_links,
  current_report_link,
  share_info
};
