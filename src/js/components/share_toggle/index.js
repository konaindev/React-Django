import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import cx from "classnames";

import ButtonToggle from "../button_toggle";
import CopyToClipboard from "../copy_to_clipboard";
import "./share_toggle.scss";

const api_update_action = "shared_reports";

function useApi(update_endpoint, report_name) {
  const [shared, setShared] = useState(null);

  const updateServer = async () => {
    if (shared === null) {
      return;
    }

    try {
      const payload = {
        update_action: api_update_action,
        shared,
        report_name
      };
      const resp = await axios.put(update_endpoint, payload);
    } catch (err) {
      console.log("Failed to update shared", err);
    }
  };

  useEffect(() => {
    updateServer();
  }, [shared]);

  return [setShared];
}

export function ShareToggle(props) {
  const { shared, share_url, update_endpoint, current_report_name } = props;

  const [flag, setFlag] = useState(shared);
  const [makeApiCall] = useApi(update_endpoint, current_report_name);

  const handleToggleChange = newValue => {
    setFlag(newValue);
    makeApiCall(newValue);
  };

  return (
    <div className="share-toggle">
      <ButtonToggle checked={flag} onChange={handleToggleChange} />

      <CopyToClipboard
        className="share-toggle__copy"
        textToCopy={share_url}
        buttonLabel="Copy Link"
        disabled={!flag}
      />
    </div>
  );
}

ShareToggle.propTypes = {
  shared: PropTypes.bool,
  share_url: PropTypes.string.isRequired,
  update_endpoint: PropTypes.string,
  current_report_name: PropTypes.string.isRequired
};

ShareToggle.defaultProps = {
  shared: false,
  share_url: ""
};

export default ShareToggle;
