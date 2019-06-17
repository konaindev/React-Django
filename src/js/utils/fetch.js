import { getCSRFToken } from "./csrf";

export function post(url, data, headers = {}, csrfProtect = true) {
  const init = {
    method: "POST",
    body: data,
    headers: new Headers(headers)
  };
  if (csrfProtect) {
    init.headers.append("X-CSRFToken", getCSRFToken());
  }
  return fetch(url, init);
}
