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
    suggestedTags: PropTypes.array,
    onChange: PropTypes.func,
    onCreateTag: PropTypes.func
  };
  static defaultProps = {
    value: "",
    suggestedTags: [],
    onChange() {},
    onCreateTag() {}
  };

  inputRef = input => {
    this.input = input;
  };

  componentDidMount() {
    this.input.node.focus();
  }

  createTag = () => this.props.onCreateTag(this.props.value);
  onEnter = e => {
    if (e.key === "Enter") {
      this.createTag();
    }
  };

  renderTagName = word => {
    const { value } = this.props;
    if (!word || !value) {
      return word;
    }
    const valueRe = new RegExp(`(${value})`, "i");
    const parts = word.split(valueRe);
    if (parts.length <= 1) {
      return word;
    }
    return parts.reduce((acc, p) => {
      let w;
      if (p.match(valueRe)) {
        w = (
          <span className="add-tag-field__suggestion-tag-name-word">{p}</span>
        );
      } else {
        w = p;
      }
      return [...acc, w];
    });
  };

  renderSuggestedTags = () => {
    if (!this.props.suggestedTags.length) {
      return;
    }
    const tags = this.props.suggestedTags.map(tag => (
      <div
        className="add-tag-field__suggestion-tag"
        onClick={() => this.props.onCreateTag(tag.word)}
        key={tag.word}
      >
        <div className="add-tag-field__suggestion-tag-name">
          {this.renderTagName(tag.word)}
        </div>
        <div className="add-tag-field__suggestion-tag-count">{tag.count}</div>
      </div>
    ));
    return <div className="add-tag-field__suggestion-tags">{tags}</div>;
  };

  render() {
    const classes = cn("add-tag-field", this.props.className);
    const text = this.props.suggestedTags.length
      ? "Suggested Tags"
      : "No suggestions found";
    return (
      <div className={classes}>
        <Input
          className="add-tag-field__input"
          placeholder="e.g. Southwestern, 2020 Fund"
          theme="simple"
          onChange={this.props.onChange}
          onKeyUp={this.onEnter}
          value={this.props.value}
          ref={this.inputRef}
        />
        {this.props.value ? (
          <Panel className="add-tag-field__suggestion">
            <div className="add-tag-field__suggestion-content">
              <div className="add-tag-field__suggestion-text">{text}</div>
            </div>
            {this.renderSuggestedTags()}
            <div className="add-tag-field__suggestion-controls">
              <Button color="primary" onClick={this.createTag}>
                Create new tag +
              </Button>
            </div>
          </Panel>
        ) : null}
      </div>
    );
  }
}
