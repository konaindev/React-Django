import { ErrorMessage, Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";

import Input from "../input";
import ModalWindow from "../modal_window";
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
    onSave: PropTypes.func,
    onFinish: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func
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

  render() {
    const { isOpen, data } = this.props;
    return (
      <ModalWindow
        className="company-modal"
        open={isOpen}
        onClose={this.props.onClose}
      >
        <ModalWindow.Head>Company Info</ModalWindow.Head>
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
                <div className="company-modal__field">
                  <div className="company-modal__label">Company</div>
                  <SelectSearch
                    name="company"
                    theme="default"
                    placeholder=""
                    components={{ DropdownIndicator: () => null }}
                    className="company-modal__input"
                    loadOptions={this.loadCompany}
                    defaultOptions={[]}
                    isCreatable={true}
                    value={values.company}
                    onCreateOption={this.onCreateCompany}
                    onChange={this.onChangeCompany}
                    onBlur={this.onBlur}
                  />
                  <div className="company-modal__error">
                    <ErrorMessage name="company.value" />
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

export default CompanyModal;
