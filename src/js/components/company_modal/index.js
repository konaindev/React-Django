import cn from "classnames";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";

import AccountSettingsField from "../account_settings_field";
import Button from "../button";
import ModalWindow from "../modal_window";
import MultiSelect from "../multi_select";
import { SelectSearch } from "../select";

import { companySchema } from "./validators";

import "./company_modal.scss";

class CompanyModal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isAccountAdmin: PropTypes.bool,
    data: PropTypes.shape({
      company: PropTypes.string,
      company_roles: PropTypes.string,
      company_roles_locked: PropTypes.bool
    }),
    companyRolesOptions: PropTypes.array,
    onSave: PropTypes.func,
    onFinish: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func
  };
  static defaultProps = {
    companyRolesOptions: [],
    isAccountAdmin: false
  };

  setFormik = formik => {
    this.formik = formik;
  };

  loadCompany = (inputValue, callback) => {
    // clearTimeout(this.loadCompanyTimeOut);
    // this.loadCompanyTimeOut = setTimeout(() => {
    //   this.props.dispatch({
    //     type: "API_COMPANY_SEARCH",
    //     data: { company: inputValue },
    //     callback
    //   });
    // }, 300);
  };

  onCreateCompany = value => {
    const option = { label: value, value };
    this.formik.setFieldValue("company", option);
  };

  onChangeCompany = company => {
    this.formik.setFieldValue("company", company);
  };

  onBlur = v => {
    this.formik.handleBlur(v);
  };

  getFieldClasses = (name, errors, touched, modifiers = []) => {
    const classes = modifiers.map(m => `account-settings-field--${m}`);
    let error_dict = {
      "account-settings-field--error": errors[name] && touched[name]
    };
    if (name === "phone") {
      error_dict["account-settings-field--error-country-code"] =
        errors["phone_country_code"] && touched["phone_country_code"];
    }
    return cn("account-settings-field", classes, error_dict);
  };

  changeCompanyLock = e => {
    e.preventDefault();
    const v = this.formik.state.values.company_roles_locked;
    this.formik.setFieldValue("company_roles_locked", !v);
  };

  render() {
    const { isOpen, data } = this.props;
    return (
      <ModalWindow
        className="company-modal"
        open={isOpen}
        onClose={this.props.onClose}
      >
        <ModalWindow.Head className="company-modal__title">
          Company Info
        </ModalWindow.Head>
        <ModalWindow.Body>
          <Formik
            ref={this.setFormik}
            validationSchema={companySchema}
            initialValues={data}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={this.props.onSave}
          >
            {({ errors, touched, values, setFieldTouched, setFieldValue }) => (
              <Form method="post" autoComplete="off">
                <div className="company-modal__content">
                  <AccountSettingsField
                    className={this.getFieldClasses("company", errors, touched)}
                    label="Company"
                    errorKey="company.value"
                  >
                    <SelectSearch
                      name="company"
                      theme="default"
                      placeholder=""
                      components={{ DropdownIndicator: () => null }}
                      className="account-settings-field__input"
                      loadOptions={this.loadCompany}
                      defaultOptions={[]}
                      isCreatable={true}
                      value={values.company}
                      onCreateOption={this.onCreateCompany}
                      onChange={this.onChangeCompany}
                      onBlur={this.onBlur}
                    />
                  </AccountSettingsField>
                  <AccountSettingsField
                    className={this.getFieldClasses(
                      "company_roles",
                      errors,
                      touched,
                      values.company_roles_locked ? ["disabled"] : []
                    )}
                    label="Company Role"
                    errorKey="company_roles"
                  >
                    <div className="company-modal__inputs-wrap">
                      <MultiSelect
                        className="account-settings-field__input company-modal__company-roles"
                        name="company_roles"
                        theme="gray"
                        isShowControls={false}
                        isShowAllOption={false}
                        isDisabled={values.company_roles_locked}
                        options={this.props.companyRolesOptions}
                        value={values.company_roles}
                        label={values.company_roles
                          ?.map(v => v.label)
                          .join(", ")}
                        onBlur={() => {
                          setFieldTouched("company_roles", true);
                        }}
                        onChange={values => {
                          setFieldValue("company_roles", values);
                        }}
                      />
                      {this.props.isAccountAdmin ? (
                        <Button
                          className="company-modal__lock"
                          color="secondary-gray"
                          onClick={this.changeCompanyLock}
                        >
                          {values.company_roles_locked ? "Unlock" : "Lock"}
                        </Button>
                      ) : null}
                    </div>
                  </AccountSettingsField>
                </div>
                <div className="company-modal__controls">
                  <Button
                    className="company-modal__save"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}

export default CompanyModal;
