import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import cx from "classnames";

import ButtonToggle from "../button_toggle";
import CopyToClipboard from "../copy_to_clipboard";
import "./share_toggle.scss";

function useApi(update_endpoint, update_action, report_name) {
  const [shared, setShared] = useState(null);

  const updateServer = async () => {
    if (shared === null) {
      return;
    }

    try {
      const payload = {
        update_action,
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
  const {
    shared,
    share_url,
    update_endpoint,
    current_report_name,
    update_action
  } = props;

  const [flag, setFlag] = useState(shared);
  const [makeApiCall] = useApi(
    update_endpoint,
    update_action,
    current_report_name
  );

  const handleToggleChange = newValue => {
    setFlag(newValue);
    makeApiCall(newValue);
  };

  return (
    <div className="share-toggle">
      <ButtonToggle checked={flag} onChange={handleToggleChange} />

      <CopyToClipboard
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
  update_action: PropTypes.string,
  current_report_name: PropTypes.string.isRequired
};

ShareToggle.defaultProps = {
  shared: false,
  update_action: "shared_reports",
  update_endpoint: "/"
};

export default ShareToggle;
