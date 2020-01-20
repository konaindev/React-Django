import cn from "classnames";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";

import { COUNTRY_FIELDS } from "../../constants";

import AccountSettingsField from "../account_settings_field";
import Button from "../button";
import GoogleAddress from "../google_address";
import Input from "../input";
import ModalWindow from "../modal_window";
import Select from "../select";

import { officeSchema } from "./validators";

import "./account_settings_modals.scss";

class OfficeModal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      office_country: PropTypes.object,
      office_street: PropTypes.string,
      office_city: PropTypes.string,
      office_state: PropTypes.object,
      office_zip: PropTypes.string,
      office_name: PropTypes.string,
      office_type: PropTypes.number
    }),
    office_options: Select.optionsType,
    office_countries: Select.optionsType,
    us_state_list: Select.optionsType,
    gb_county_list: Select.optionsType,
    loadAddress: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    data: {
      office_country: {
        label: COUNTRY_FIELDS.USA.full_name,
        value: COUNTRY_FIELDS.USA.short_name
      },
      office_street: "",
      office_city: "",
      office_state: { label: "", value: "" },
      office_zip: "",
      office_name: "",
      office_type: null
    },
    office_options: [],
    office_countries: [],
    loadAddress() {},
    onSave() {}
  };

  setFormik = formik => {
    this.formik = formik;
  };

  getFieldClasses = (name, errors, touched, modifiers = []) => {
    const classes = modifiers.map(m => `account-settings-field--${m}`);
    let error_dict = {
      "account-settings-field--error": errors[name] && touched[name]
    };
    return cn("account-settings-field", classes, error_dict);
  };

  onChangeCountry = value => {
    this.formik.setFieldValue("office_street", "");
    this.formik.setFieldValue("office_country", value);
    this.formik.setFieldValue("office_state", {
      label: "",
      value: ""
    });
    this.formik.setFieldTouched("office_state");
  };

  onChangeOfficeAddress = value => {
    if (value.street) {
      this.formik.setFieldValue("office_street", value.street);
      this.formik.setFieldValue("office_city", value.city);
      this.formik.setFieldValue("office_state", {
        label: value.state,
        value: value.state
      });
      this.formik.setFieldValue("office_zip", value.zip);
      if (value.country == COUNTRY_FIELDS.GBR.short_name) {
        this.formik.setFieldValue("office_country", {
          label: COUNTRY_FIELDS.GBR.full_name,
          value: COUNTRY_FIELDS.GBR.short_name
        });
      } else if (value.country == COUNTRY_FIELDS.USA.short_name) {
        this.formik.setFieldValue("office_country", {
          label: COUNTRY_FIELDS.USA.full_name,
          value: COUNTRY_FIELDS.USA.short_name
        });
      }
    } else {
      this.formik.setFieldValue("office_street", value.value);
    }
  };

  onBlurOfficeAddress = () => {
    this.formik.setFieldTouched("office_street");
    const formikContext = this.formik.getFormikContext();
    if (formikContext.values.office_street) {
      this.formik.setFieldTouched("office_street");
    }
    if (formikContext.values.office_city) {
      this.formik.setFieldTouched("office_city");
    }
    if (formikContext.values.office_state) {
      this.formik.setFieldTouched("office_state");
    }
    if (formikContext.values.office_zip) {
      this.formik.setFieldTouched("office_zip");
    }
  };

  render() {
    const {
      isOpen,
      data,
      companyAddresses,
      office_options,
      office_countries,
      us_state_list,
      gb_county_list,
      onClose,
      loadAddress
    } = this.props;
    return (
      <ModalWindow className="form-modal" open={isOpen} onClose={onClose}>
        <ModalWindow.Head className="form-modal__title">
          Office Info
        </ModalWindow.Head>
        <ModalWindow.Body>
          <Formik
            ref={this.setFormik}
            initialValues={data}
            validationSchema={officeSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={this.props.onSave}
          >
            {({
              errors,
              touched,
              values,
              handleBlur,
              handleChange,
              setFieldTouched,
              setFieldValue
            }) => (
              <Form method="post" autoComplete="off">
                <div className="form-modal__content">
                  <AccountSettingsField
                    className={this.getFieldClasses(
                      "office_country",
                      errors,
                      touched
                    )}
                    label="Country"
                    errorKey="office_country"
                  >
                    <Select
                      className="account-settings-field__input"
                      name="office_country"
                      theme="gray"
                      isShowControls={false}
                      isShowAllOption={false}
                      value={values.office_country}
                      options={office_countries}
                      onBlur={() => {
                        setFieldTouched("office_country", true);
                      }}
                      onChange={this.onChangeCountry}
                    />
                  </AccountSettingsField>
                  <AccountSettingsField
                    className={this.getFieldClasses(
                      "office_street",
                      errors,
                      touched
                    )}
                    label="Address"
                    errorKey="office_street"
                  >
                    <GoogleAddress
                      name="office_street"
                      className="account-settings-field__input"
                      loadOptions={loadAddress}
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
                        COUNTRY_FIELDS[(values.office_country?.value)]
                          ?.address_fields.city
                      }
                      errorKey="office_city"
                    >
                      <Input
                        className="account-settings-field__input"
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
                        COUNTRY_FIELDS[(values.office_country?.value)]
                          ?.address_fields.state
                      }
                      errorKey="office_state"
                    >
                      <Select
                        className="account-settings-field__input"
                        name="office_state"
                        theme="gray"
                        isSearchable={true}
                        options={
                          values.office_country?.value ==
                          COUNTRY_FIELDS.USA.short_name
                            ? us_state_list
                            : gb_county_list
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
                        touched
                      )}
                      label={
                        COUNTRY_FIELDS[(values.office_country?.value)]
                          ?.address_fields.zip
                      }
                      errorKey="office_zip"
                    >
                      <Input
                        className="account-settings-field__input"
                        name="office_zip"
                        theme="gray"
                        value={values.office_zip}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </AccountSettingsField>
                  </div>
                  <div className="account-settings__field-grid">
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
                        className="account-settings-field__input"
                        name="office_type"
                        theme="gray"
                        options={office_options}
                        value={values.office_type}
                        onBlur={() => {
                          setFieldTouched("office_type", true);
                        }}
                        onChange={value => {
                          setFieldValue("office_type", value);
                        }}
                      />
                    </AccountSettingsField>
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
                        className="account-settings-field__input"
                        name="office_name"
                        theme="gray"
                        value={values.office_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </AccountSettingsField>
                  </div>
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

export default OfficeModal;
