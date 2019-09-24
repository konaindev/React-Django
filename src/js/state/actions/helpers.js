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
