import React, { Component } from "react";
import PropTypes from "prop-types";

import Panel from "../panel";
import { formatDate } from "../../utils/formatters";
import "./release_notes_table.scss";

export const release_notesTable = ({ release_notes }) => (
  <Panel>
    <table className="release-notes-table">
      {release_notes.map(note => (
        <tr key={note.id} className="release-notes-table__row">
          <td className="release-notes-table__col release-notes-table__version">
            {note.version}
          </td>
          <td className="release-notes-table__col release-notes-table__title">
            {note.title}
          </td>
          <td className="release-notes-table__col release-notes-table__date">
            {formatDate(note.date)}
          </td>
          <td className="release-notes-table__col">
            <a
              className="release-notes-table__link"
              href={`/releases/${note.id}`}
            >
              NOTES <big>&rsaquo;</big>
            </a>
          </td>
        </tr>
      ))}
    </table>
  </Panel>
);

release_notesTable.propTypes = {
  release_notes: PropTypes.array.isRequired
};

export default release_notesTable;
