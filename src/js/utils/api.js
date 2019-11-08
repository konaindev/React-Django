import axios from "axios";
import { store } from "../App";

const validateStatus = status => {
  return status >= 200 && status < 500;
};

export function axiosPost(url, data, headers = {}) {
  const { token } = store.getState();
  const { access } = token;

  const config = {
    method: "post",
    headers: { ...headers },
    data,
    url,
    validateStatus
  };
  if (access) {
    config.headers["Authorization"] = `bearer ${access}`;
  }
  if (data.toString() === "[object FormData]") {
    config.headers["content-type"] = "multipart/form-data";
  }
  // if (csrfProtect) {
  //   config.headers["X-CSRFToken"] = getCSRFToken();
  // }
  return axios(config);
}
export function axiosGet(url, config = { validateStatus }) {
  const { token } = store.getState();
  const { access } = token;
  const params = {
    method: "get",
    headers: { Accept: "application/json" },
    url,
    ...config
  };
  if (access) {
    params.headers["Authorization"] = `Bearer ${access}`;
  }
  return axios(params);
}
