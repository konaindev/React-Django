import React from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import Button from "../button";
import Input from "../input";

import AccountForm from "../account_form";
import PageAuth from "../page_auth";
import FormField from "../form_field";
import Yup from "../../yup";

import "./reset_password_form.scss";
const ResetPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required")
});
class ResetPasswordForm extends React.PureComponent {
  onSubmit = (values, actions) => {
    actions.setSubmitting(false);
    const data = { ...values };
    let email = values.email;
    this.props.dispatch({
      type: "SEND_PASSWORD_RESET_EMAIL",
      data: {
        email: email
      }
    });
  };

  render() {
    return (
      <PageAuth backLink="/">
        <AccountForm
          className="reset-password"
          title="Reset my password"
          subtitle="Enter your email address below and we’ll send a special link to get you back on track."
        >
          <Formik
            onSubmit={this.onSubmit}
            validationSchema={ResetPasswordFormSchema}
            initialValues={{
              email: ""
            }}
          >
            {({
              errors,
              values,
              touched,
              handleChange,
              handleSubmit,
              handleBlur
            }) => (
              <Form method="post" onSubmit={handleSubmit}>
                <FormField
                  label="Email:"
                  error={errors.email}
                  showError={touched.email && errors.email}
                >
                  <Input
                    type="email"
                    name="email"
                    theme="highlight"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </FormField>
                <Button
                  className="reset-password__button"
                  color="primary"
                  fullWidth={true}
                  uppercase={true}
                  type="submit"
                >
                  Send Link
                </Button>
              </Form>
            )}
          </Formik>
        </AccountForm>
      </PageAuth>
    );
  }
}

export default connect()(ResetPasswordForm);
