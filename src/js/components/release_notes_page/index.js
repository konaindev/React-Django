import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import PageChrome from "../page_chrome";
import ReleaseNotesTable from "../release_notes_table";
import SectionHeader from "../section_header";

export const ReleaseNotesPage = ({ releaseNotes }) => (
  <PageChrome>
    <Container>
      <SectionHeader title="Releases" smallMarginTop />
      <ReleaseNotesTable releaseNotes={releaseNotes} />
    </Container>
  </PageChrome>
);

ReleaseNotesTable.propTypes = {
  releaseNotes: PropTypes.array.isRequired
};

export default ReleaseNotesPage;
