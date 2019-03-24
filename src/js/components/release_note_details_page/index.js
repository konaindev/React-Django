import React, { Component } from "react";
import PropTypes from "prop-types";

import Breadcrumbs from "../breadcrumbs";
import Container from "../container";
import PageChrome from "../page_chrome";
import ReleaseNoteDetails from "../release_note_details";
import { formatDate } from "../../utils/formatters";

const getBreadcrumbs = release_note => [
  {
    text: "Releases",
    link: "/releases"
  },
  {
    text: `${release_note.version} Release: ${
      release_note.title
    } | ${formatDate(release_note.date)}`
  }
];

export const ReleaseNoteDetailsPage = ({ release_note }) => (
  <PageChrome>
    <Container>
      <Breadcrumbs breadcrumbs={getBreadcrumbs(release_note)} />
      <ReleaseNoteDetails release_note={release_note} />
    </Container>
  </PageChrome>
);

ReleaseNoteDetailsPage.propTypes = {
  release_note: PropTypes.object.isRequired
};

export default ReleaseNoteDetailsPage;
