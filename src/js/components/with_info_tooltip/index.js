import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _get from "lodash/get";

import Tooltip, { TooltipAnchor } from "../rmb_tooltip";

/**
 * @description Wraps a component to inject info tooltip
 * accepts "infoTooltip" i18n key prop which is used to read from redux store
 * converts it into a node which is <Tooltip> component
 */
const withInfoToolip = WrappedComponent => {
  class ComponentToConnect extends Component {
    renderInfoTooltip = () => {
      let { infoTooltipText } = this.props;

      if (infoTooltipText) {
        return (
          <Tooltip text={infoTooltipText} placement="top" theme="light-dark">
            <TooltipAnchor />
          </Tooltip>
        );
      } else {
        return null;
      }
    };

    render() {
      let { infoTooltip, infoTooltipText, ...restProps } = this.props;

      return (
        <WrappedComponent
          renderInfoTooltip={this.renderInfoTooltip}
          {...restProps}
        />
      );
    }
  }

  const mapStateToProps = (state, { infoTooltip }) => {
    const language = _get(state, "uiStrings.language");
    const texts = _get(state, `uiStrings.strings.${language}`, {});

    return {
      infoTooltipText: texts[`${infoTooltip}.tooltip`]
    };
  };

  return connect(mapStateToProps)(ComponentToConnect);
};

export default withInfoToolip;
