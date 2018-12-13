/**
 * @description Gets the current CSRF token.
 *
 * Returns null if none can be found.
 *
 * @returns {string=}
 */
export const getCSRFToken = () =>
  document.querySelector("[name=csrfmiddlewaretoken]").value;
