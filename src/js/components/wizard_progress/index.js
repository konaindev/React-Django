import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import { Ok } from "../../icons";

import "./wizard_progress.scss";

const renderSteps = steps =>
  steps.map(({ name, isActive, isComplete }, i) => {
    const classes = cn("wizard-progress__step", {
      "wizard-progress__step--active": isActive,
      "wizard-progress__step--complete": isComplete
    });
    return (
      <div className={classes} key={i}>
        <div className="wizard-progress__step-number">{i + 1}</div>
        {isComplete && <Ok className="wizard-progress__icon" />}
        {name}
      </div>
    );
  });

const WizardProgress = ({ steps, className }) => {
  const classes = cn("wizard-progress", className);
  return <div className={classes}>{renderSteps(steps)}</div>;
};

WizardProgress.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isActive: PropTypes.bool
    })
  ).isRequired
};

export default WizardProgress;
