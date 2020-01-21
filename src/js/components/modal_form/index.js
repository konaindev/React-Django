import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import ModalWindow from "../modal_window";

import "./modal_form.scss";

class ModalForm extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.object,
    validationSchema: PropTypes.object,
    isOpen: PropTypes.bool,
    setFormik: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    isOpen: false,
    data: {},
    setFormik() {},
    onClose() {},
    onSave() {}
  };

  setFormik = formik => {
    this.formik = formik;
    this.props.setFormik(formik);
  };

  render() {
    return (
      <ModalWindow
        className="modal-form"
        open={this.props.isOpen}
        onClose={this.props.onClose}
      >
        <ModalWindow.Head className="modal-form__title">
          {this.props.title}
        </ModalWindow.Head>
        <ModalWindow.Body>
          <Formik
            ref={this.setFormik}
            validationSchema={this.props.validationSchema}
            initialValues={this.props.data}
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
                <div className="modal-form__content">
                  {this.props.children({
                    errors,
                    touched,
                    values,
                    handleBlur,
                    setFieldTouched,
                    setFieldValue
                  })}
                </div>
                <div className="modal-form__controls">
                  <Button
                    className="modal-form__save"
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

export default ModalForm;
