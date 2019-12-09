import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import Input from "../input";
import Panel from "../panel";

import "./add_tag_input.scss";

export default class AddTagField extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };
  static defaultProps = {
    value: "",
    onChange() {}
  };

  inputRef = input => {
    this.input = input;
  };

  componentDidMount() {
    this.input.node.focus();
  }

  render() {
    const classes = cn("add-tag-field", this.props.className);
    return (
      <div className={classes}>
        <Input
          className="add-tag-field__input"
          placeholder="e.g. Southwestern, 2020 Fund"
          theme="simple"
          onChange={this.props.onChange}
          value={this.props.value}
          ref={this.inputRef}
        />
        {this.props.value ? (
          <Panel className="add-tag-field__suggestion">
            <div className="add-tag-field__suggestion-content">
              <div className="add-tag-field__suggestion-text">
                Suggested Tags
              </div>
            </div>
            <div className="add-tag-field__suggestion-controls">
              <Button color="primary">Create new tag +</Button>
            </div>
          </Panel>
        ) : null}
      </div>
    );
  }
}
