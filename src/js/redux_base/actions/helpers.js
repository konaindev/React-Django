export const URLS = {
  base: process.env.BASE_URL || "http//localhost:8000",
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

export const API_URL_PREFIX = `${URLS.base}${URLS.ver}`;

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

export const createRequestTypes = base => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  FAILURE: `${base}_FAILURE`
});
