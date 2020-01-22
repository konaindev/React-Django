//
// Tools that allow us to pop up javascript confirmation alerts
// before a user completes a "Save" on a project admin page.
//

/** Global variable containing a warning message, if necessary. */
window._submit_warning = null;

/** Global method available to parties that wish to show a save warning. */
window.enable_submit_warning = function(message) {
  window._submit_warning = message;
};

window.remove_submit_warning = function() {
  window._submit_warning = null;
};

/** Put a submit event handler on all inputs of type=submit */
function instrumentSubmitElements() {
  /** Pop up a confirmation dialog during submit, if requested. */
  function onSubmit(event) {
    if (window._submit_warning != null) {
      // pop up dialog
      const confirmation = confirm(window._submit_warning);

      // bail out; don't submit
      if (!confirmation) {
        event.preventDefault();
        // old browsers like this
        return false;
      }
    }

    // old browsers like this
    return true;
  }

  const forms = document.querySelectorAll("form");
  for (const form of forms) {
    form.addEventListener("submit", onSubmit);
  }
}

// instrument our document, safely
if (document.readyState !== "loading") {
  instrumentSubmitElements();
} else {
  document.addEventListener("DOMContentLoaded", instrumentSubmitElements);
}
