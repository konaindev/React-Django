import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import Panel from "../panel";
import { formatDate } from "../../utils/formatters";
import "./release_note_details.scss";

export const ReleaseNoteDetails = ({ releaseNote }) => (
  <Panel className="release-note-details">
    <p className="release-note-details__title">
      {releaseNote.version} Release {releaseNote.title}{" "}
      <span className="release-note-details__title-date">
        | {formatDate(releaseNote.date)}
      </span>
    </p>
    <div className="release-note-details__content">
      <ReactMarkdown source={releaseNote.content} />
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
