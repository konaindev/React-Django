import React, { Component } from "react";
import PropTypes from "prop-types";

import Breadcrumbs from "../breadcrumbs";
import Container from "../container";
import PageChrome from "../page_chrome";
import ReleaseNoteDetails from "../release_note_details";
import { formatDate } from "../../utils/formatters";

const getBreadcrumbs = releaseNote => [
  {
    text: "Releases",
    link: "/releases"
  },
  {
    text: `${releaseNote.version} Release: ${releaseNote.title} | ${formatDate(
      releaseNote.date
    )}`
  }
];

export const ReleaseNoteDetailsPage = ({ releaseNote }) => (
  <PageChrome>
    <Container>
      <Breadcrumbs breadcrumbs={getBreadcrumbs(releaseNote)} />
      <ReleaseNoteDetails releaseNote={releaseNote} />
    </Container>
  </PageChrome>
);

ReleaseNoteDetailsPage.propTypes = {
  releaseNote: PropTypes.object.isRequired
};

export default ReleaseNoteDetailsPage;
