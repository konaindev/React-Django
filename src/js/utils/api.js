import axios from "axios";
import { store } from "../App";

const validateStatus = status => {
  return status >= 200 && status < 500;
};

export function axiosPost(url, data, headers = {}) {
  const { token } = store.getState();
  const { access } = token;

  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers
    },
    data,
    url,
    validateStatus
  };
  if (access) {
    config.headers["Authorization"] = `Bearer ${access}`;
  }
  if (data.toString() === "[object FormData]") {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return axios(config);
}

export function axiosGet(url, config = { validateStatus }) {
  const { token } = store.getState();
  const { access } = token;
  const params = {
    method: "GET",
    headers: { Accept: "application/json" },
    url,
    ...config
  };
  if (access) {
    params.headers["Authorization"] = `Bearer ${access}`;
  }
  return axios(params);
}
