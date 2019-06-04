import { Formik } from "formik";
import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import Input from "./index";

storiesOf("Input", module).add("text", () => <Input type="text" />);
