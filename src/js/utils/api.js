import axios from "axios";
import { store } from "../App";
import { getCSRFToken } from "./csrf";

export function axiosPost(url, data, headers = {}, csrfProtect = true) {
  const { token } = store.getState();
  const { access } = token;

  const config = {
    method: "post",
    headers: { ...headers },
    data,
    url
  };
  if (access) {
    config.headers["Authorization"] = `bearer ${access}`;
  }
  if (data.toString() === "[object FormData]") {
    config.headers["content-type"] = "multipart/form-data";
  }
  if (csrfProtect) {
    config.headers["X-CSRFToken"] = getCSRFToken();
  }
  return axios(config);
}

export function axiosGet(url, config = {}) {
  const { token } = store.getState();
  const { access } = token;
  const params = {
    method: "get",
    headers: { Accept: "application/json" },
    url,
    withCredentials: true,
    ...config
  };
  if (access) {
    params.headers["Authorization"] = `bearer ${access}`;
  }
  return axios(params);
}
