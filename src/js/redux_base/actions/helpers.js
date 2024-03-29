/**
 * This function was added because CircleCI adds trailing slashes to URLs that are put into ENV Vars
 * The function returns the BASE_URL if present in the environment without a trailing slash.
 * @returns {string | string}
 */
const get_base_url = () => {
  let base_url = process.env.BASE_URL || "http//localhost:8000";
  if (base_url[base_url.length - 1] == "/") {
    base_url = base_url.substring(0, base_url.length - 1);
  }
  return base_url;
};

export const URLS = {
  base: get_base_url(),
  ver: process.env.API_VERSION || "/api/v1",
  login: "/token/",
  refresh: "/token/refresh/",
  portfolio: "/portfolio",
  locations: "/locations",
  asset_managers: "/asset_managers",
  market: "/market",
  kpi: "/kpi",
  project: "/projects",
  tutorial: "/tutorial",
  dashboard: "/dashboard/"
};

try {
  console.log("LOGGING ENV");
  console.log("BASE_URL", process.env.BASE_URL);
  console.log("URLS.base", URLS.base);
} catch (e) {}

export const API_URL_PREFIX = `${URLS.base}${URLS.ver}`;

export const createAPIUrl = path => {
  return `${URLS.base}${URLS.ver}${path}`;
};

export const createFEUrl = path => {
  return `${window.location.origin}${path}`;
};

export const createActions = branch => ({
  set: x => ({ type: `UPDATE_${branch.toUpperCase()}`, x }),
  get: args => ({
    ...args,
    type: "FETCH_API_GET",
    branch,
    url: args.url || `${URLS.base}${URLS.ver}${URLS[branch]}`
  }),
  post: args => ({
    ...args,
    type: "FETCH_API_POST",
    branch,
    url: args.url || `${URLS.base}${URLS.ver}${URLS[branch]}`
  })
});

export const createAjaxAction = (
  baseActionType,
  endpoint,
  query = ""
) => params => {
  let queryString = typeof query === "function" ? query(params) : query;
  let url = `${API_URL_PREFIX}${endpoint}${queryString}`;
  return {
    ...(typeof params === "object" ? params : {}),
    type: baseActionType.startsWith("AJAX_POST")
      ? "FETCH_API_POST"
      : "FETCH_API_GET",
    url,
    baseActionType
  };
};
