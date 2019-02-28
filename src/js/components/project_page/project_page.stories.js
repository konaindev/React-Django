import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ProjectPage from "./index";

const props = {
  project: { public_id: "pro_example", name: "Example Project" },
  report_links: [
    {
      name: "Special Periods",
      periods: [
        {
          url: "/projects/pro_example/report/baseline/",
          description: "Baseline Period (Jan 01 2017 - May 07 2018)"
        },
        {
          url: "/projects/pro_example/report/last-week/",
          description: "Last Week (Dec 24 2018 - Dec 31 2018)"
        },
        {
          url: "/projects/pro_example/report/last-two-weeks/",
          description: "Last Two Weeks (Dec 17 2018 - Dec 31 2018)"
        },
        {
          url: "/projects/pro_example/report/last-four-weeks/",
          description: "Last Four Weeks (Dec 03 2018 - Dec 31 2018)"
        },
        {
          url: "/projects/pro_example/report/campaign/",
          description: "Campaign To Date (May 07 2018 - Dec 31 2018)"
        }
      ]
    },
    {
      name: "Campaign Periods",
      periods: [
        {
          url: "/projects/pro_example/report/2018-05-07,2018-05-14/",
          description: "May 07 2018 - May 14 2018"
        },
        {
          url: "/projects/pro_example/report/2018-05-14,2018-05-21/",
          description: "May 14 2018 - May 21 2018"
        },
        {
          url: "/projects/pro_example/report/2018-05-21,2018-05-28/",
          description: "May 21 2018 - May 28 2018"
        },
        {
          url: "/projects/pro_example/report/2018-05-28,2018-06-04/",
          description: "May 28 2018 - Jun 04 2018"
        },
        {
          url: "/projects/pro_example/report/2018-06-04,2018-06-11/",
          description: "Jun 04 2018 - Jun 11 2018"
        },
        {
          url: "/projects/pro_example/report/2018-06-11,2018-06-18/",
          description: "Jun 11 2018 - Jun 18 2018"
        },
        {
          url: "/projects/pro_example/report/2018-06-18,2018-06-25/",
          description: "Jun 18 2018 - Jun 25 2018"
        },
        {
          url: "/projects/pro_example/report/2018-06-25,2018-07-02/",
          description: "Jun 25 2018 - Jul 02 2018"
        },
        {
          url: "/projects/pro_example/report/2018-07-02,2018-07-09/",
          description: "Jul 02 2018 - Jul 09 2018"
        },
        {
          url: "/projects/pro_example/report/2018-07-09,2018-07-16/",
          description: "Jul 09 2018 - Jul 16 2018"
        },
        {
          url: "/projects/pro_example/report/2018-07-16,2018-07-23/",
          description: "Jul 16 2018 - Jul 23 2018"
        },
        {
          url: "/projects/pro_example/report/2018-07-23,2018-07-30/",
          description: "Jul 23 2018 - Jul 30 2018"
        },
        {
          url: "/projects/pro_example/report/2018-07-30,2018-08-06/",
          description: "Jul 30 2018 - Aug 06 2018"
        },
        {
          url: "/projects/pro_example/report/2018-08-06,2018-08-13/",
          description: "Aug 06 2018 - Aug 13 2018"
        },
        {
          url: "/projects/pro_example/report/2018-08-13,2018-08-20/",
          description: "Aug 13 2018 - Aug 20 2018"
        },
        {
          url: "/projects/pro_example/report/2018-08-20,2018-08-27/",
          description: "Aug 20 2018 - Aug 27 2018"
        },
        {
          url: "/projects/pro_example/report/2018-08-27,2018-09-03/",
          description: "Aug 27 2018 - Sep 03 2018"
        },
        {
          url: "/projects/pro_example/report/2018-09-03,2018-09-10/",
          description: "Sep 03 2018 - Sep 10 2018"
        },
        {
          url: "/projects/pro_example/report/2018-09-10,2018-09-17/",
          description: "Sep 10 2018 - Sep 17 2018"
        },
        {
          url: "/projects/pro_example/report/2018-09-17,2018-09-24/",
          description: "Sep 17 2018 - Sep 24 2018"
        },
        {
          url: "/projects/pro_example/report/2018-09-24,2018-10-01/",
          description: "Sep 24 2018 - Oct 01 2018"
        },
        {
          url: "/projects/pro_example/report/2018-10-01,2018-10-08/",
          description: "Oct 01 2018 - Oct 08 2018"
        },
        {
          url: "/projects/pro_example/report/2018-10-08,2018-10-15/",
          description: "Oct 08 2018 - Oct 15 2018"
        },
        {
          url: "/projects/pro_example/report/2018-10-15,2018-10-22/",
          description: "Oct 15 2018 - Oct 22 2018"
        },
        {
          url: "/projects/pro_example/report/2018-10-22,2018-10-29/",
          description: "Oct 22 2018 - Oct 29 2018"
        },
        {
          url: "/projects/pro_example/report/2018-10-29,2018-11-05/",
          description: "Oct 29 2018 - Nov 05 2018"
        },
        {
          url: "/projects/pro_example/report/2018-11-05,2018-11-12/",
          description: "Nov 05 2018 - Nov 12 2018"
        },
        {
          url: "/projects/pro_example/report/2018-11-12,2018-11-19/",
          description: "Nov 12 2018 - Nov 19 2018"
        },
        {
          url: "/projects/pro_example/report/2018-11-19,2018-11-26/",
          description: "Nov 19 2018 - Nov 26 2018"
        },
        {
          url: "/projects/pro_example/report/2018-11-26,2018-12-03/",
          description: "Nov 26 2018 - Dec 03 2018"
        },
        {
          url: "/projects/pro_example/report/2018-12-03,2018-12-10/",
          description: "Dec 03 2018 - Dec 10 2018"
        },
        {
          url: "/projects/pro_example/report/2018-12-10,2018-12-17/",
          description: "Dec 10 2018 - Dec 17 2018"
        },
        {
          url: "/projects/pro_example/report/2018-12-17,2018-12-24/",
          description: "Dec 17 2018 - Dec 24 2018"
        },
        {
          url: "/projects/pro_example/report/2018-12-24,2018-12-31/",
          description: "Dec 24 2018 - Dec 31 2018"
        }
      ]
    }
  ]
};

storiesOf("ProjectPage", module).add("default", () => (
  <ProjectPage {...props} />
));
