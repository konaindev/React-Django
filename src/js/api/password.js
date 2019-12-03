import { axiosPost } from "../utils/api";
import { API_URL_PREFIX } from "../redux_base/actions/helpers";

export const validatePassword = (password, user_id) =>
  axiosPost(`${API_URL_PREFIX}/users/password-rules/`, {
    password,
    user_id
  }).then(response => response.data.errors);
