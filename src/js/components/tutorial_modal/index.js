import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import ModalWindow from "../modal_window";

import "./tutorial_modal.scss";

export default class TutorialModal extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tutorials: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired
      })
    ).isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onFinish: PropTypes.func
  };

  static defaultProps = {
    open: true,
    onClose: () => {},
    onFinish: () => {}
  };

  state = {
    step: 0
  };

  nextHandler = () => {
    this.setState({ step: this.state.step + 1 });
  };

  toStep = e => {
    const step = Number(e.target.dataset.index);
    this.setState({ step });
  };

  renderIndicators = () => {
    return this.props.tutorials.map((_, i) => {
      const classes = cn("tutorial-modal__nav-indicator", {
        "tutorial-modal__nav-indicator--active": i === this.state.step
      });
      return (
        <div className={classes} data-index={i} key={i} onClick={this.toStep} />
      );
    });
  };

  renderNavBtn = () => {
    const { tutorials, onFinish } = this.props;
    if (tutorials.length - 1 === this.state.step) {
      return (
        <Button
          className="tutorial-modal__nav-button"
          color="primary"
          onClick={onFinish}
        >
          GOT IT
        </Button>
      );
    }
    return (
      <Button
        className="tutorial-modal__nav-button"
        color="highlight"
        onClick={this.nextHandler}
      >
        Next
      </Button>
    );
  };

  render() {
    const { title, tutorials, open, onClose } = this.props;
    const caption = tutorials[this.state.step].caption;
    const imageUrl = tutorials[this.state.step].image_url;
    const style = {
      backgroundImage: `url(${imageUrl})`
    };
    return (
      <ModalWindow
        className="tutorial-modal"
        closeOnOverlayClick={false}
        closeOnEsc={false}
        open={open}
        onClose={onClose}
      >
        <ModalWindow.Head className="tutorial-modal__header">
          {title}
        </ModalWindow.Head>
        <ModalWindow.Body>
          <div className="tutorial-modal__image" style={style} />
          <div className="tutorial-modal__caption">{caption}</div>
          <div className="tutorial-modal__nav">
            <div>{this.renderIndicators()}</div>
            {this.renderNavBtn()}
          </div>
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}
