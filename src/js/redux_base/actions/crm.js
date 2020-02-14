export const companyActions = {
  fetchAddresses: (data, callback) => ({
    type: "API_COMPANY_ADDRESS",
    data,
    callback
  }),
  searchCompany: (company, callback) => ({
    type: "API_COMPANY_SEARCH",
    data: { company },
    callback
  })
};
