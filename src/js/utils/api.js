import axios from "axios";

import { getCSRFToken } from "./csrf";

export function axiosPost(url, data, headers = {}, csrfProtect = true) {
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

export function axiosGet(url, config = {}) {
  const params = {
    method: "get",
    headers: { Accept: "application/json" },
    url,
    withCredentials: true,
    ...config
  };
  return axios(params);
}
