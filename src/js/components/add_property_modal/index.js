import PropTypes from "prop-types";
import React from "react";

import AddPropertyForm from "../add_property_form";
import ModalWindow from "../modal_window";

export default function AddPropertyModal(props) {
  return (
    <ModalWindow open={props.open} onClose={props.onClose}>
      <ModalWindow.Head>Add Property</ModalWindow.Head>
      <ModalWindow.Body>
        <AddPropertyForm {...props.formProps} />
      </ModalWindow.Body>
    </ModalWindow>
  );
}
AddPropertyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  formProps: PropTypes.shape({
    packages: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
    ).isRequired,
    states: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
    ).isRequired,
    post_url: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func
};
AddPropertyModal.defaultProps = {
  onClose: () => {}
};
