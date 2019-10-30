import { PROJECT_OVERALL_GET, PROJECT_REPORTS_GET } from "../actions";

const initialState = {
  loadingOverall: false,
  loadingReports: false,
  overall: false,
  reports: {
    baseline: false,
    tam: false,
    modeling: false,
    campaign_plan: false,
    performance: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_OVERALL_GET.REQUEST:
      return {
        ...state,
        loadingOverall: true
      };
    case PROJECT_OVERALL_GET.SUCCESS:
      return {
        ...state,
        loadingOverall: false,
        overall: action.data
      };
    case PROJECT_OVERALL_GET.FAILURE:
      return {
        ...state,
        loadingOverall: false,
        overall: false
      };
    case PROJECT_REPORTS_GET.REQUEST:
      return {
        ...state,
        loadingReports: true
      };
    case PROJECT_REPORTS_GET.SUCCESS:
      return {
        ...state,
        loadingReports: false,
        reports: action.data
      };
    case PROJECT_REPORTS_GET.FAILURE:
      return {
        ...state,
        loadingReports: false,
        reports: false
      };
    default:
      return state;
  }
};

export default reducer;
