import { axiosGet, axiosPost } from "../utils/api";
import { qsStringify } from "../utils/misc";
import { API_URL_PREFIX } from "../redux_base/actions/helpers";

export const updateSecurityData = data =>
  axiosPost(`${API_URL_PREFIX}/account-security`, data);

export const updateUserProfileData = data =>
  axiosPost(`${API_URL_PREFIX}/account-user`, data);

export const updateCompanyData = data =>
  axiosPost(`${API_URL_PREFIX}/account-company`, data);

export const updateOfficeData = data =>
  axiosPost(`${API_URL_PREFIX}/account-office`, data);

export const updateReportsSettingsData = data =>
  axiosPost(`${API_URL_PREFIX}/account-reports`, data);

export const validateAddress = data =>
  axiosPost(`${API_URL_PREFIX}/validate-address`, data);

export const getPropertiesData = data => {
  let q = "";
  if (data) {
    q = qsStringify(data);
  }
  return axiosGet(`${API_URL_PREFIX}/account-reports${q}`);
};
