import { axiosPost } from "../utils/api";
import { URLS } from "../redux_base/actions/helpers";

export const validatePassword = (password, hash) =>
  axiosPost(`${URLS.base}/users/validate-password`, { password, hash }).then(
    response => response.data.errors
  );
