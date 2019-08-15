import axios from "axios";

import { getCSRFToken } from "./csrf";

export function post(url, data, headers = {}, csrfProtect = true) {
  const config = {
    method: "post",
    headers: { ...headers },
    data,
    url
  };
  if (data.toString() === "[object FormData]") {
    config.headers["content-type"] = "multipart/form-data";
  }
  if (csrfProtect) {
    config.headers["X-CSRFToken"] = getCSRFToken();
  }
  return axios(config);
}

export function get(url, config = {}) {
  const params = {
    method: "get",
    url,
    responseType: "json",
    withCredentials: true,
    ...config
  };
  return axios(params);
}
