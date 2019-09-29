/**
 * @description Gets the current CSRF token.
 *
 * Returns null if none can be found.
 *
 * @returns {string=}
 */
export const getCSRFToken = () => {
  const input = document.querySelector("[name=csrfmiddlewaretoken]");
  return input && input.value;
};
