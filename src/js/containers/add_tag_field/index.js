import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AddTagInput from "../../components/add_tag_input";
import { TYPING_TIMEOUT } from "../../constants";
import { projectActions } from "../../redux_base/actions";

import AddButton from "./add";

class AddTagField extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.object,
    isAddTagInput: PropTypes.bool,
    suggestedTags: PropTypes.array
  };

  showAddTagInput = () => this.props.dispatch(projectActions.showAddTagInput());

  onAddTag = word => {
    if (this.addTagTimeout) {
      clearTimeout(this.addTagTimeout);
    }
    this.addTagTimeout = setTimeout(
      () =>
        this.props.dispatch(
          projectActions.searchTags(this.props.project.public_id)({ word })
        ),
      TYPING_TIMEOUT
    );
  };

  createTag = word =>
    this.props.dispatch(
      projectActions.createTag(this.props.project.public_id)({ body: { word } })
    );

  hideInput = value => {
    if (!value) {
      this.props.dispatch(projectActions.hideTagInput());
    }
  };

  render() {
    let component;
    if (this.props.isAddTagInput) {
      component = (
        <AddTagInput
          className={this.props.className}
          suggestedTags={this.props.suggestedTags}
          onChange={this.onAddTag}
          onCreateTag={this.createTag}
          onBlur={this.hideInput}
        />
      );
    } else {
      component = <AddButton onClick={this.showAddTagInput} />;
    }
    return component;
  }
}

const mapState = state => ({
  project: state.projectReports.project,
  isAddTagInput: state.projectReports.isAddTagInput,
  suggestedTags: state.projectReports.suggestedTags
});

export default connect(mapState)(AddTagField);
