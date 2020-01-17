import cn from "classnames";
import { Formik, Form, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";

import { COUNTRY_FIELDS } from "../../constants";

import AccountSettingsField from "../account_settings_field";
import GoogleAddress from "../google_address";
import Input from "../input";
import ModalWindow from "../modal_window";
import Select, { SelectSearch } from "../select";

import "./account_settings_modals.scss";

class OfficeModal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    data: PropTypes.object,
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.selectedCountry = COUNTRY_FIELDS.USA.short_name;
  }

  getFieldClasses = (name, errors, touched, modifiers = []) => {
    const classes = modifiers.map(m => `account-settings-field--${m}`);
    let error_dict = {
      "account-settings-field--error": errors[name] && touched[name]
    };
    return cn("account-settings-field", classes, error_dict);
  };

  loadAddress = (inputValue, callback) => {
    // const data = { address: inputValue };
    // const context = this.formik?.getFormikContext();
    // const businessId = context?.values?.company?.value;
    // const businessName = context?.values?.company?.label;
    // if (businessId !== businessName) {
    //   data["business_id"] = businessId;
    // }
    // clearTimeout(this.loadAddressTimeOut);
    // this.loadAddressTimeOut = setTimeout(() => {
    //   this.props.dispatch({
    //     type: "API_COMPANY_ADDRESS",
    //     data,
    //     callback
    //   });
    // }, 300);
  };

  render() {
    const { isOpen, data, companyAddresses, onClose } = this.props;
    return (
      <ModalWindow className="form-modal" open={isOpen} onClose={onClose}>
        <ModalWindow.Head className="form-modal__title">
          Office Info
        </ModalWindow.Head>
        <ModalWindow.Body>
          <Formik validateOnBlur={true} validateOnChange={true}>
            {({ errors, touched, values, setFieldTouched, setFieldValue }) => (
              <Form method="post" autoComplete="off">
                <div className="form-modal__content">
                  <AccountSettingsField
                    className={this.getFieldClasses("company", errors, touched)}
                    label="Address"
                    errorKey="office_street"
                  >
                    <GoogleAddress
                      name="office_street"
                      className="account-settings__input"
                      loadOptions={this.loadAddress}
                      cacheOptions={false}
                      companyAddresses={companyAddresses}
                      theme=""
                      labelCompany=""
                      labelGoogle=""
                      display="full"
                      value={values.office_street}
                      onChange={this.onChangeOfficeAddress}
                      onBlur={this.onBlurOfficeAddress}
                    />
                  </AccountSettingsField>
                  <div className="account-settings__field-grid account-settings__field-grid--col-3">
                    <AccountSettingsField
                      className={this.getFieldClasses(
                        "office_city",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                      label={
                        COUNTRY_FIELDS[this.selectedCountry].address_fields.city
                      }
                      errorKey="office_city"
                    >
                      <Input
                        className="account-settings__input"
                        name="office_city"
                        theme="gray"
                        value={values.office_city}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                    </AccountSettingsField>
                    <AccountSettingsField
                      className={this.getFieldClasses(
                        "office_state",
                        errors,
                        touched
                      )}
                      label={
                        COUNTRY_FIELDS[this.selectedCountry].address_fields
                          .state
                      }
                      errorKey="office_state"
                    >
                      <Select
                        className="account-settings__input"
                        name="office_state"
                        theme="gray"
                        isSearchable={true}
                        options={
                          this.selectedCountry == COUNTRY_FIELDS.USA.short_name
                            ? this.props.us_state_list
                            : this.props.gb_county_list
                        }
                        value={values.office_state}
                        onBlur={() => {
                          setFieldTouched("office_state", true);
                        }}
                        onChange={value => {
                          setFieldValue("office_state", value);
                        }}
                      />
                    </AccountSettingsField>
                    <AccountSettingsField
                      className={this.getFieldClasses(
                        "office_zip",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                      label={
                        COUNTRY_FIELDS[this.selectedCountry].address_fields.zip
                      }
                      errorKey="office_zip"
                    >
                      <Input
                        className="account-settings__input"
                        name="office_zip"
                        theme="gray"
                        value={values.office_zip}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      ></Input>
                    </AccountSettingsField>
                  </div>
                  <div className="account-settings__field-grid">
                    <AccountSettingsField
                      className={this.getFieldClasses(
                        "office_name",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                      label="Name"
                      errorKey="office_name"
                    >
                      <Input
                        className="account-settings__input"
                        name="office_name"
                        theme="gray"
                        value={values.office_name}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                    </AccountSettingsField>
                    <AccountSettingsField
                      className={this.getFieldClasses(
                        "office_type",
                        errors,
                        touched
                      )}
                      label="Type"
                      errorKey="office_type"
                    >
                      <Select
                        className="account-settings__input"
                        name="office_type"
                        theme="gray"
                        options={this.props.office_options}
                        value={values.office_type}
                        onBlur={() => {
                          setFieldTouched("office_type", true);
                        }}
                        onChange={value => {
                          setFieldValue("office_type", value);
                        }}
                      />
                    </AccountSettingsField>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </ModalWindow.Body>
      </ModalWindow>
    );
  }
}

export default OfficeModal;
