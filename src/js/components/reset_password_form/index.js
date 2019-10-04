import React from "react";
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

export default class ResetPasswordForm extends React.Component {
  onSubmit = () => {
    actions.setSubmitting(false);
    const data = { ...values };
    data.email = values.email;
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
                  Set Password
                </Button>
              </Form>
            )}
          </Formik>
        </AccountForm>
      </PageAuth>
    );
  }
}
