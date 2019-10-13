import { axiosPost } from "../utils/api";

export const updateSecurityData = data =>
  axiosPost(`${process.env.BASE_URL}/users/account-security`, data);

export const updateProfileData = data =>
  axiosPost(`${process.env.BASE_URL}/users/account-profile`, data);
