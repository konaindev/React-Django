/**
 * @description Return the value of a named cookie.
 *
 * Returns an empty string if the cookie cannot be identified.
 *
 * @returns {string}
 */
export const getCookie = name => {
  const cookieName = `${name}=`;
  const decoded = decodeURIComponent(document.cookie);
  const splits = decoded.split(";");
  for (const split of splits) {
    const trimmed = split.trim();
    if (trimmed.indexOf(cookieName) == 0) {
      return trimmed.substring(cookieName.length, trimmed.length);
    }
  }
  return "";
};

export const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`;
};
