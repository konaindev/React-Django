import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import cx from "classnames";

import ButtonToggle from "../button_toggle";
import CopyToClipboard from "../copy_to_clipboard";
import "./share_toggle.scss";

const ENDPOINT = "/endpoint-to-update-flag";

function updateSharedEffect(flagInState) {
  const [flag, setFlag] = useState(null);

  const sendPostRequest = async () => {
    if (flag === null) {
      return setFlag(flagInState);
    }

    try {
      const resp = await axios.post(ENDPOINT, { shared: flagInState });
      setFlag(resp.flag);
    } catch (err) {
      setFlag(flagInState);
    }
  };

  useEffect(() => {
    sendPostRequest();
  }, [flagInState]);

  return flag;
}

export function ShareToggle(props) {
  const { shared: flagInProps, share_url } = props;

  const [flagInState, setFlagInState] = useState(flagInProps);
  const flagFromApi = updateSharedEffect(flagInState);
  const flagToPass = flagFromApi === null ? flagInState : flagFromApi;

  return (
    <div className="share-toggle">
      <ButtonToggle checked={flagToPass} onChange={setFlagInState} />

      <CopyToClipboard
        textToCopy={share_url}
        buttonLabel="Copy Link"
        disabled={!flagToPass}
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
