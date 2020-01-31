import cn from "classnames";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import ModalWindow from "../modal_window";

import "./modal_form.scss";

class ModalForm extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    theme: PropTypes.oneOf(["dark", "highlight"]),
    title: PropTypes.string.isRequired,
    initialData: PropTypes.object,
    validationSchema: PropTypes.object,
    isOpen: PropTypes.bool,
    setFormik: PropTypes.func,
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    theme: "dark",
    isOpen: false,
    initialData: {},
    setFormik() {},
    onClose() {},
    onSave() {}
  };

  setFormik = formik => {
    this.formik = formik;
    this.props.setFormik(formik);
  };

  onError = errors => {
    this.formik.setSubmitting(false);
    const formikErrors = {};
    for (let k of Object.keys(errors)) {
      formikErrors[k] = errors[k][0].message;
    }
    this.formik.setErrors(formikErrors);
  };

  onSave = values => {
    const onSuccess = this.props.onSuccess;
    const onError = this.props.onError || this.onError;
    this.props.onSave(onSuccess, onError)(values);
  };

  render() {
    const { theme } = this.props;
    const classes = cn("modal-form", {
      [`modal-form--${theme}`]: theme !== "dark"
    });
    return (
      <ModalWindow
        className={classes}
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
            initialValues={this.props.initialData}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={this.onSave}
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
                <div className="modal-form__content">
                  {this.props.children({
                    errors,
                    touched,
                    values,
                    handleBlur,
                    handleChange,
                    setFieldTouched,
                    setFieldValue,
                    onError: this.onError
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
