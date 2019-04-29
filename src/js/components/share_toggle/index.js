import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import cx from "classnames";

import ButtonToggle from "../button_toggle";
import CopyToClipboard from "../copy_to_clipboard";
import "./share_toggle.scss";

const ENDPOINT = "/endpoint-to-update-shared-flag";

function useApi() {
  const [shared, setShared] = useState(null);

  const updateServer = async () => {
    if (shared === null) {
      return;
    }

    try {
      const resp = await axios.post(ENDPOINT, { shared });
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
  const { shared, share_url } = props;

  const [flag, setFlag] = useState(shared);
  const [makeApiCall] = useApi();

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
  share_url: PropTypes.string.isRequired
};

ShareToggle.defaultProps = {
  shared: false
};

export default ShareToggle;
