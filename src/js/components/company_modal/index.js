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
    data: PropTypes.shape({
      company: PropTypes.string,
      company_roles: PropTypes.string
    }),
    companyRolesOptions: PropTypes.array,
    onSave: PropTypes.func,
    onFinish: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func
  };
  static defaultProps = {
    companyRolesOptions: []
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
            {({ errors, touched, values, setFieldTouched }) => (
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
                      touched
                    )}
                    label="Company Role"
                    errorKey="company_roles"
                  >
                    <MultiSelect
                      className="account-settings-field__input company-modal__company-roles"
                      name="company_roles"
                      theme="gray"
                      isShowControls={false}
                      isShowAllOption={false}
                      options={this.props.companyRolesOptions}
                      value={values.company_roles}
                      label={values.company_roles?.map(v => v.label).join(", ")}
                      onBlur={() => {
                        this.unsetMessage();
                        setFieldTouched("company_roles", true);
                      }}
                      onChange={values => {
                        this.unsetMessage();
                        setFieldValue("company_roles", values);
                      }}
                    />
                    <Button
                      className="company-modal__lock"
                      color="secondary-gray"
                    >
                      Unlock
                    </Button>
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
