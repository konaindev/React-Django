import cn from "classnames";
import _pick from "lodash/pick";
import PropTypes from "prop-types";
import React from "react";

import { COUNTRY_FIELDS } from "../../constants";
import {
  accountSettings as actions,
  addressModal
} from "../../redux_base/actions";

import AccountSettingsField from "../account_settings_field";
import AddressModal from "../address_modal";
import { validateAddress } from "../../api/account_settings";
import GoogleAddress from "../google_address";
import Input from "../input";
import ModalForm from "../modal_form";
import Select from "../select";

import { officeSchema } from "./validators";

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
      office_type: PropTypes.object
    }),
    office_options: Select.optionsType,
    office_countries: Select.optionsType,
    us_state_list: Select.optionsType,
    gb_county_list: Select.optionsType,
    loadAddress: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    onSuccess: PropTypes.func,
    dispatch: PropTypes.func
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

  updateValues = values => {
    this.formik.setFieldValue("office_street", values.office_street);
    this.formik.setFieldValue("office_city", values.office_city);
    this.formik.setFieldValue("office_state", {
      label: values.full_state,
      value: values.full_state
    });
    this.formik.setFieldValue("office_zip", values.office_zip);
  };

  onSave = () => values => {
    const data = { ...values };
    data["office_type"] = values.office_type.value;
    data["office_country"] = values.office_country.value;
    data["office_state"] = values.office_state.value;
    const addressValues = _pick(values, [
      "office_country",
      "office_street",
      "office_city",
      "office_state",
      "office_zip"
    ]);
    validateAddress(addressValues).then(response => {
      if (response.data.error) {
        this.setState({ invalid_address: true });
        this.formik.setErrors({
          office_street:
            "Unable to verify address. Please provide a valid address.",
          office_city: "*",
          office_state: "*",
          office_zip: "*"
        });
      } else {
        this.setState({ addresses: response.data, invalid_address: false });
        this.props.dispatch(addressModal.open(data, response.data));
      }
    });
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
      loadAddress,
      onSuccess
    } = this.props;
    return (
      <ModalForm
        title="Office Info"
        isOpen={isOpen}
        initialData={data}
        validationSchema={officeSchema}
        onSuccess={onSuccess}
        onSave={this.onSave}
        onClose={onClose}
        setFormik={this.setFormik}
      >
        {({
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldTouched,
          setFieldValue,
          onError
        }) => (
          <>
            <AddressModal
              title="Confirm Office Address"
              callback={onSuccess}
              onError={onError}
              dispatch_type="API_ACCOUNT_PROFILE_OFFICE"
              updateValues={this.updateValues}
            />
            <AccountSettingsField
              label="Country"
              name="office_country"
              errorKey="office_country"
              {...{ errors, touched }}
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
              label="Address"
              name="office_street"
              errorKey="office_street"
              {...{ errors, touched }}
            >
              <GoogleAddress
                name="office_street"
                className="account-settings-field__input"
                loadOptions={loadAddress}
                cacheOptions={false}
                companyAddresses={companyAddresses}
                theme="gray"
                labelCompany=""
                labelGoogle=""
                display="full"
                value={values.office_street}
                onChange={this.onChangeOfficeAddress}
                onBlur={this.onBlurOfficeAddress}
              />
            </AccountSettingsField>
            <div className="modal-form__grid modal-form__grid--col-3">
              <AccountSettingsField
                label={
                  COUNTRY_FIELDS[(values.office_country?.value)]?.address_fields
                    .city
                }
                name="office_city"
                errorKey="office_city"
                modifiers={["max-width"]}
                {...{ errors, touched }}
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
                label={
                  COUNTRY_FIELDS[(values.office_country?.value)]?.address_fields
                    .state
                }
                name="office_state"
                errorKey="office_state"
                {...{ errors, touched }}
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
                label={
                  COUNTRY_FIELDS[(values.office_country?.value)]?.address_fields
                    .zip
                }
                name="office_zip"
                errorKey="office_zip"
                {...{ errors, touched }}
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
            <div className="modal-form__grid">
              <AccountSettingsField
                label="Type"
                name="office_type"
                errorKey="office_type"
                {...{ errors, touched }}
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
                label="Name"
                name="office_name"
                errorKey="office_name"
                modifiers={["max-width"]}
                {...{ errors, touched }}
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
          </>
        )}
      </ModalForm>
    );
  }
}

export default OfficeModal;
