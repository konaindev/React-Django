export const URLS = {
  base: process.env.BASE_URL || "http//localhost:8000",
  login: "/api/token/",
  refresh: "/api/token/refresh/",
  portfolio: "/portfolio",
  locations: "/locations",
  asset_managers: "/asset_managers",
  market: "/market",
  kpi: "/kpi",
  project: "/projects",
  tutorial: "/tutorial"
};

export const createActions = branch => ({
  set: x => ({ type: `UPDATE_${branch.toUpperCase()}`, x }),
  get: args => ({
    ...args,
    type: "FETCH_API_GET",
    branch,
    url: args.url || `${URLS.base}${URLS[branch]}`
  }),
  post: args => ({
    ...args,
    type: "FETCH_API_POST",
    branch,
    url: args.url || `${URLS.base}${URLS[branch]}`
  })
});
