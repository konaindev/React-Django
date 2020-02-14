import React from "react";
import { connect } from "react-redux";

import CompanyModal from "../../components/company_modal";
import { accountSettings } from "../../redux_base/actions";
import renderWrapper from "../shared/base_container";

class SettingsCompanyModalContainer extends React.PureComponent {
  onSave = (onSuccess, onError) => values => {
    const data = {
      company: values.company.value,
      company_roles: values.company_roles.map(i => i.value)
    };
    this.props.dispatch(
      accountSettings.postCompanyData(data, onSuccess, onError)
    );
  };

  render() {
    return renderWrapper(
      <CompanyModal {...this.props} onSave={this.onSave} />,
      true,
      false
    );
  }
}

export default connect()(SettingsCompanyModalContainer);
