import PropTypes from "prop-types";
import React from "react";

import { AddWhite } from "../../icons";
import Input from "../input";

export class AddInput extends React.Component {
  static propTypes = { onChange: PropTypes.func };
  static defaultProps = { onChange() {} };

  inputRef = input => {
    this.input = input;
  };

  componentDidMount() {
    this.input.node.focus();
  }

  render() {
    return (
      <div className="property-overview__add-tag property-overview__add-tag--input">
        <Input
          className="property-overview__add-tag-input"
          placeholder="e.g. Southwestern, 2020 Fund"
          theme="simple"
          onChange={this.props.onChange}
          ref={this.inputRef}
        />
      </div>
    );
  }
}

export const AddButton = ({ onClick }) => {
  return (
    <div className="property-overview__add-tag" onClick={onClick}>
      <AddWhite />
      <div className="property-overview__add-tag-text">Add Tag</div>
    </div>
  );
};
AddButton.propTypes = { onClick: PropTypes.func };
AddButton.defaultProps = { onClick() {} };
