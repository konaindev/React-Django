import React from "react";
import { storiesOf } from "@storybook/react";

import ReleaseNotesTable from "./index";

const props = {
  releaseNotes: [
    {
      id: 1,
      title: "Release: Alderaan",
      version: "2.13.18",
      date: "2018-11-11",
      content: "content"
    },
    {
      id: 2,
      title: "Release: Alderaan",
      version: "2.14.12",
      date: "2018-12-03",
      content: "content"
    },
    {
      id: 3,
      title: "Release: Alderaan",
      version: "2.15.1",
      date: "2018-12-11",
      content: "content"
    },
    {
      id: 4,
      title: "Release: Alderaan",
      version: "2.16.3",
      date: "2018-12-29",
      content: "content"
    },
    {
      id: 5,
      title: "Release: Alderaan",
      version: "2.16.18",
      date: "2019-01-11",
      content: "content"
    },
    {
      id: 6,
      title: "Release: Alderaan",
      version: "2.17.2",
      date: "2019-02-03",
      content: "content"
    },
    {
      id: 7,
      title: "Release: Alderaan",
      version: "2.18.1",
      date: "2019-02-28",
      content: "content"
    }
  ]
};

storiesOf("ReleaseNotesTable", module).add("default", () => (
  <ReleaseNotesTable {...props} />
));
