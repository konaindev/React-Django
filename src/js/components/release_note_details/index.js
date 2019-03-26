import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import Panel from "../panel";
import { formatDate } from "../../utils/formatters";
import "./release_note_details.scss";

export const ReleaseNoteDetails = ({ release_note }) => (
  <Panel className="release-note-details">
    <p className="release-note-details__title">
      {release_note.version} Release {release_note.title}{" "}
      <span className="release-note-details__title-date">
        | {formatDate(release_note.date)}
      </span>
    </p>
    <div className="release-note-details__content">
      <ReactMarkdown source={release_note.content} />
    </div>
    <div className="release-note-details__footer">
      <p>
        Thanks!
        <br />
        The Remarkably Team
      </p>
    </div>
  </Panel>
);

export default ReleaseNoteDetails;
