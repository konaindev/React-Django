import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import WizardProgress from "../wizard_progress";

import "./account_form.scss";

const AccountForm = ({ className, steps, title, subtitle, children }) => {
  const classes = cn("account-form", className);
  return (
    <div className={classes}>
      <WizardProgress className="account-form__wizard" steps={steps} />
      <div className="account-form__title">{title}</div>
      <div className="account-form__subtitle">{subtitle}</div>
      <div className="account-form__body">{children}</div>
    </div>
  );
};

AccountForm.fieldClass = "account-form__field";

AccountForm.propTypes = {
  classes: PropTypes.string,
  steps: WizardProgress.propTypes.steps,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default AccountForm;
