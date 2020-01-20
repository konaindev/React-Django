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

import "./account_settings_modals.scss";

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
    loadCompany: PropTypes.func,
    onChangeCompany: PropTypes.func,
    onSave: PropTypes.func,
    onFinish: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func
  };
  static defaultProps = {
    companyRolesOptions: [],
    isAccountAdmin: false,
    loadCompany() {},
    onChangeCompany() {},
    onSave() {}
  };

  setFormik = formik => {
    this.formik = formik;
  };

  onCreateCompany = value => {
    const option = { label: value, value };
    this.formik.setFieldValue("company", option);
  };

  onChangeCompany = company => {
    this.formik.setFieldValue("company", company);
    this.props.onChangeCompany(company);
  };

  getFieldClasses = (name, errors, touched, modifiers = []) => {
    const classes = modifiers.map(m => `account-settings-field--${m}`);
    let error_dict = {
      "account-settings-field--error": errors[name] && touched[name]
    };
    return cn("account-settings-field", classes, error_dict);
  };

  render() {
    const { isOpen, data } = this.props;
    return (
      <ModalWindow
        className="form-modal"
        open={isOpen}
        onClose={this.props.onClose}
      >
        <ModalWindow.Head className="form-modal__title">
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
            {({
              errors,
              touched,
              values,
              handleBlur,
              setFieldTouched,
              setFieldValue
            }) => (
              <Form method="post" autoComplete="off">
                <div className="form-modal__content">
                  <AccountSettingsField
                    className={this.getFieldClasses("company", errors, touched)}
                    label="Company"
                    errorKey="company.value"
                  >
                    <SelectSearch
                      name="company"
                      theme="gray"
                      placeholder=""
                      components={{ DropdownIndicator: () => null }}
                      className="account-settings-field__input"
                      loadOptions={this.props.loadCompany}
                      defaultOptions={[]}
                      isCreatable={true}
                      value={values.company}
                      onCreateOption={this.onCreateCompany}
                      onChange={this.onChangeCompany}
                      onBlur={handleBlur}
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
                    </div>
                  </AccountSettingsField>
                </div>
                <div className="settings-modal__controls">
                  <Button
                    className="settings-modal__save"
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
