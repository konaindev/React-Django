import { axiosGet, axiosPost } from "../utils/api";
import { qsStringify } from "../utils/misc";
import { URLS } from "../redux_base/actions/helpers";

export const updateSecurityData = data =>
  axiosPost(`${URLS.base}/users/account-security`, data);

export const updateProfileData = data =>
  axiosPost(`${URLS.base}/users/account-profile`, data);

export const updateReportsSettingsData = data =>
  axiosPost(`${URLS.base}/users/account-reports`, data);

export const validateAddress = data =>
  axiosPost(`${URLS.base}/users/validate-address`, data);

export const getPropertiesData = data => {
  let q = "";
  if (data) {
    q = qsStringify(data);
  }
  return axiosGet(`${URLS.base}/users/account-reports${q}`);
};
