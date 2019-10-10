import { axiosPost } from "../utils/api";

export const validatePassword = (password, hash) =>
  axiosPost("/users/validate-password", { password, hash }).then(
    response => response.data.errors
  );
