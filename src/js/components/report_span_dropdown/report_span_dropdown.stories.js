import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ReportSpanDropdown from "./index";

const props = {
  current_report_link: { name: "Some Report", link: "/some/url" },
  report_links: [
    {
      name: "Special Periods",
      periods: [
        {
          url: "/projects/pro_eekgau8mfkbc34iq/report/baseline/",
          description: "Baseline Period (Jan 01 2017 - May 07 2018)"
        },
        {
          url: "/projects/pro_eekgau8mfkbc34iq/report/last-week/",
          description: "Last Week (Dec 24 2018 - Dec 31 2018)"
        },
        {
          url: "/projects/pro_eekgau8mfkbc34iq/report/last-two-weeks/",
          description: "Last Two Weeks (Dec 17 2018 - Dec 31 2018)"
        },
        {
          url: "/projects/pro_eekgau8mfkbc34iq/report/last-four-weeks/",
          description: "Last Four Weeks (Dec 03 2018 - Dec 31 2018)"
        },
        {
          url: "/projects/pro_eekgau8mfkbc34iq/report/campaign/",
          description: "Campaign To Date (May 07 2018 - Dec 31 2018)"
        }
      ]
    }
  ]
};

storiesOf("ReportSpanDropdown", module).add("default", () => (
  <ReportSpanDropdown {...props} />
));
