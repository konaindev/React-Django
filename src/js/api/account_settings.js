import { axiosGet, axiosPost } from "../utils/api";
import { qsStringify } from "../utils/misc";

export const updateSecurityData = data =>
  axiosPost(`${process.env.BASE_URL}/users/account-security`, data);

export const updateProfileData = data =>
  axiosPost(`${process.env.BASE_URL}/users/account-profile`, data);

export const updateReportsSettingsData = data =>
  axiosPost(`${process.env.BASE_URL}/users/account-reports`, data);

export const getPropertiesData = data => {
  let q = "";
  if (data) {
    q = qsStringify(data);
  }
  return axiosGet(`${process.env.BASE_URL}/users/account-reports${q}`);
};
