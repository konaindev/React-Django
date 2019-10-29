import cn from "classnames";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";
import React, { Component } from "react";

import "./modal_window.scss";

export default class ModalWindow extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    className: PropTypes.string,
    theme: PropTypes.oneOf(["", "small"]),
    onClose: PropTypes.func
  };
  static defaultProps = {
    className: "",
    onClose() {}
  };

  render() {
    const { className, theme, open, onClose, ...props } = this.props;
    const classNames = {
      modal: cn(
        "modal-window",
        { [`modal-window--${theme}`]: theme },
        className
      ),
      overlay: "modal-overlay",
      closeButton: "modal-window__close"
    };
    return (
      <Modal
        classNames={classNames}
        open={open}
        closeOnOverlayClick={true}
        center={true}
        focusTrapped={false}
        onClose={onClose}
        {...props}
      >
        {this.props.children}
      </Modal>
    );
  }
}

function ModalWindowHead(props) {
  const className = cn("modal-window__head", props.className);
  return <div className={className}>{props.children}</div>;
}
ModalWindowHead.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
ModalWindowHead.defaultProps = {
  className: ""
};

function ModalWindowBody(props) {
  const className = cn("modal-window__body", props.className);
  return <div className={className}>{props.children}</div>;
}
ModalWindowBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
ModalWindowBody.defaultProps = {
  className: ""
};

ModalWindow.Head = ModalWindowHead;
ModalWindow.Body = ModalWindowBody;
