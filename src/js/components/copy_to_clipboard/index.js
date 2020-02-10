import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import cn from "classnames";

import Button from "../button";
import { Link, Tick } from "../../icons";
import "./copy_to_clipboard.scss";

function CopyIcon() {
  return (
    <React.Fragment>
      <Link className="copy-to-clipboard__icon" />
      <span className="copy-to-clipboard__label">Share Link</span>
    </React.Fragment>
  );
}

function CopiedIcon() {
  return (
    <React.Fragment>
      <Tick className="copy-to-clipboard__icon" />
      <span className="copy-to-clipboard__label">Copied!</span>
    </React.Fragment>
  );
}

export function CopyToClipboardButton({
  className,
  textToCopy,
  disabled,
  CopyNode,
  CopiedNode
}) {
  const copyCallback = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const [copied, setCopied] = useState(false);
  const classes = cn("copy-to-clipboard", className, {
    "copy-to-clipboard--disbale": disabled
  });

  if (disabled) {
    return (
      <Button className={classes} disabled>
        <CopyNode />
      </Button>
    );
  }

  return (
    <CopyToClipboard text={textToCopy} onCopy={copyCallback}>
      <Button className={classes}>
        {copied ? <CopiedNode /> : <CopyNode />}
      </Button>
    </CopyToClipboard>
  );
}

CopyToClipboardButton.propTypes = {
  textToCopy: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  CopyNode: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  CopiedNode: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onClick: PropTypes.func
};

CopyToClipboardButton.defaultProps = {
  disabled: false,
  CopyNode: CopyIcon,
  CopiedNode: CopiedIcon,
  onClick: () => {}
};

export default CopyToClipboardButton;
