import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import cn from "classnames";

import Button from "../button";
import "./copy_to_clipboard.scss";

export function CopyToClipboardButton({ disabled, textToCopy, buttonLabel }) {
  const copiedText = "Copied!";

  const copyCallback = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const [copied, setCopied] = useState(false);

  if (disabled) {
    return (
      <Button className="copy-to-clipboard copy-to-clipboard--disabled">
        {buttonLabel}
      </Button>
    );
  }

  return (
    <CopyToClipboard text={textToCopy} onCopy={copyCallback}>
      <Button
        color="primary"
        className="copy-to-clipboard copy-to-clipboard--enabled"
      >
        {copied ? copiedText : buttonLabel}
      </Button>
    </CopyToClipboard>
  );
}

CopyToClipboardButton.propTypes = {
  disabled: PropTypes.bool,
  textToCopy: PropTypes.string,
  buttonLabel: PropTypes.string,
  onClick: PropTypes.func
};

CopyToClipboardButton.defaultProps = {
  disabled: false,
  buttonLabel: "Copy Text",
  onClick: () => {}
};

export default CopyToClipboardButton;
