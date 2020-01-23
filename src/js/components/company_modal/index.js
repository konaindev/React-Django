import _isEqual from "lodash/isEqual";
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
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    companyRolesOptions: [],
    loadCompany() {},
    onChangeCompany() {},
    onSave() {}
  };

  constructor(props) {
    super(props);
    this.state = { rolesLocked: !!props.data.company_roles?.length };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !_isEqual(prevProps.data.company_roles, this.props.data.company_roles)
    ) {
      this.setState({ rolesLocked: !!this.props.data.company_roles?.length });
    }
  }

  setFormik = formik => {
    this.formik = formik;
  };

  mapCompanyRolesToOptions = roles =>
    this.props.companyRolesOptions.filter(i => roles.includes(i.value));

  onCreateCompany = value => {
    const option = { label: value, value };
    this.formik.setFieldValue("company", option);
    this.formik.setFieldValue("company_roles", []);
    this.setState({ rolesLocked: false });
  };

  onChangeCompany = company => {
    this.formik.setFieldValue("company", company);
    const roles = this.mapCompanyRolesToOptions(company.roles || []);
    this.formik.setFieldValue("company_roles", roles);
    this.setState({ rolesLocked: !!roles.length });
    this.props.onChangeCompany(company);
  };

  render() {
    return (
      <ModalForm
        title="Company Info"
        initialData={this.props.data}
        validationSchema={companySchema}
        setFormik={this.setFormik}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSuccess={this.props.onSuccess}
        onError={this.props.onError}
        onSave={this.props.onSave}
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
              name="company"
              label="Company"
              errorKey="company.value"
              errors={errors}
              touched={touched}
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
                onBlur={() => setFieldTouched("company", true)}
              />
            </AccountSettingsField>
            <AccountSettingsField
              name="company_roles"
              label="Company Role"
              errorKey="company_roles"
              errors={errors}
              touched={touched}
              modifiers={this.state.rolesLocked ? ["disabled"] : []}
            >
              <div className="modal-form__inputs-wrap">
                <MultiSelect
                  className="account-settings-field__input company-modal__company-roles"
                  name="company_roles"
                  theme="gray"
                  isShowControls={false}
                  isShowAllOption={false}
                  isDisabled={this.state.rolesLocked}
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
