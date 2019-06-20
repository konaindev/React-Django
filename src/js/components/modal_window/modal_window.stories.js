import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import Button from "../button";

import ModalWindow from "./index";

class ModalWithOpen extends Component {
  state = { isOpen: true };

  openWindow = () => this.setState({ isOpen: true });
  onClose = () => this.setState({ isOpen: false });

  render() {
    return (
      <div style={{ height: "100vh", backgroundColor: "#fff" }}>
        <Button
          color="primary"
          style={{ position: "absolute", top: "50%", left: "50%" }}
          onClick={this.openWindow}
        >
          Open Window
        </Button>
        <ModalWindow open={this.state.isOpen} onClose={this.onClose}>
          <ModalWindow.Head>Title</ModalWindow.Head>
          <ModalWindow.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalWindow.Body>
        </ModalWindow>
      </div>
    );
  }
}

storiesOf("ModalWindow", module).add("default", () => <ModalWithOpen />);
