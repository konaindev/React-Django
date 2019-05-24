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
    onClose: PropTypes.func
  };
  static defaultProps = {
    className: "",
    onClose() {}
  };

  render() {
    const { className, open, onClose, ...props } = this.props;
    const classNames = {
      modal: cn("modal-window", className),
      overlay: "modal-overlay",
      closeButton: "modal-window__close"
    };
    const styles = {
      closeIcon: { display: "none" }
    };
    return (
      <Modal
        classNames={classNames}
        open={open}
        closeOnOverlayClick={true}
        center={true}
        styles={styles}
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

function ModalWindowButtonsGroup(props) {
  const className = cn("modal-window__buttons-group", props.className);
  return <div className={className}>{props.children}</div>;
}
ModalWindowButtonsGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
ModalWindowButtonsGroup.defaultProps = {
  className: ""
};

ModalWindow.Head = ModalWindowHead;
ModalWindow.Body = ModalWindowBody;
ModalWindow.BGroup = ModalWindowButtonsGroup;
