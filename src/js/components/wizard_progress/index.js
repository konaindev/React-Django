import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import "./wizard_progress.scss";

const renderSteps = steps =>
  steps.map(({ name, isActive }, i) => {
    const classes = cn("wizard-progress__step", {
      "wizard-progress__step--active": isActive
    });
    return (
      <div className={classes} key={i}>
        <div className="wizard-progress__step-number">{i + 1}</div>
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
