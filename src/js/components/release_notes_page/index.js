import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import PageChrome from "../page_chrome";
import ReleaseNotesTable from "../release_notes_table";
import SectionHeader from "../section_header";

export const ReleaseNotesPage = ({ release_notes }) => (
  <PageChrome>
    <Container>
      <SectionHeader title="Releases" smallMarginTop />
      <ReleaseNotesTable release_notes={release_notes} />
    </Container>
  </PageChrome>
);

ReleaseNotesTable.propTypes = {
  release_notes: PropTypes.array.isRequired
};

export default ReleaseNotesPage;
