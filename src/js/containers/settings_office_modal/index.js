import _pick from "lodash/pick";
import React from "react";
import { connect } from "react-redux";

import { validateAddress } from "../../api/account_settings";
import OfficeModal from "../../components/office_modal";
import { addressModal } from "../../redux_base/actions";

import renderWrapper from "../shared/base_container";

class SettingsOfficeModalContainer extends React.PureComponent {
  setModal = modal => {
    this.modal = modal;
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
        this.modal.formik.setErrors({
          office_street:
            "Unable to verify address. Please provide a valid address.",
          office_city: "*",
          office_state: "*",
          office_zip: "*"
        });
      } else {
        this.props.dispatch(addressModal.open(data, response.data));
      }
    });
  };

  render() {
    return renderWrapper(
      <OfficeModal {...this.props} onSave={this.onSave} ref={this.setModal} />,
      true,
      false
    );
  }
}

export default connect()(SettingsOfficeModalContainer);
