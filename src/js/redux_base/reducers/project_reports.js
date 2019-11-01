import { PROJECT_OVERALL_GET, PROJECT_REPORTS_GET } from "../actions";

const initialState = {
  loadingProject: true,
  loadingReports: true,
  project: false,
  reports: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_OVERALL_GET.REQUEST:
      return {
        ...state,
        loadingProject: true
      };
    case PROJECT_OVERALL_GET.SUCCESS:
      return {
        ...state,
        loadingProject: false,
        project: action.data
      };
    case PROJECT_OVERALL_GET.FAILURE:
      return {
        ...state,
        loadingProject: false,
        project: false
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
