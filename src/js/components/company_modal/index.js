import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import AccountSettingsField from "../account_settings_field";
import ModalForm from "../modal_form";
import MultiSelect from "../multi_select";
import { SelectSearch } from "../select";

import { companySchema } from "./validators";

import "./company_modal.scss";

class CompanyModal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    data: PropTypes.shape({
      company: PropTypes.string,
      company_roles: PropTypes.array
    }),
    companyRolesOptions: PropTypes.array,
    loadCompany: PropTypes.func,
    onChangeCompany: PropTypes.func,
    onSave: PropTypes.func,
    onClose: PropTypes.func
  };

  static defaultProps = {
    companyRolesOptions: [],
    loadCompany() {},
    onChangeCompany() {},
    onSave() {}
  };

  constructor(props) {
    super(props);
    this.rolesLocked = !!props.data.company_roles.length;
  }

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
    return (
      <ModalForm
        title="Company Info"
        validationSchema={companySchema}
        setFormik={this.setFormik}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
      >
        {({
          errors,
          touched,
          values,
          handleBlur,
          setFieldTouched,
          setFieldValue
        }) => (
          <>
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
                this.rolesLocked ? ["disabled"] : []
              )}
              label="Company Role"
              errorKey="company_roles"
            >
              <div className="modal-form__inputs-wrap">
                <MultiSelect
                  className="account-settings-field__input company-modal__company-roles"
                  name="company_roles"
                  theme="gray"
                  isShowControls={false}
                  isShowAllOption={false}
                  isDisabled={this.rolesLocked}
                  options={this.props.companyRolesOptions}
                  value={values.company_roles}
                  label={values.company_roles?.map(v => v.label).join(", ")}
                  onBlur={() => {
                    setFieldTouched("company_roles", true);
                  }}
                  onChange={values => {
                    setFieldValue("company_roles", values);
                  }}
                />
              </div>
            </AccountSettingsField>
          </>
        )}
      </ModalForm>
    );
  }
}

export default CompanyModal;
