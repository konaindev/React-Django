const initialState = {
  loadingProject: true,
  loadingReports: true,
  project: false,
  reports: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "AJAX_PROJECT_OVERALL_REQUEST":
      return {
        ...state,
        loadingProject: true,
        project: false,
        reports: false
      };
    case "AJAX_PROJECT_OVERALL_SUCCESS":
      return {
        ...state,
        loadingProject: false,
        project: action.payload
      };
    case "AJAX_PROJECT_OVERALL_FAILURE":
      return {
        ...state,
        loadingProject: false
      };
    case "AJAX_PROJECT_REPORTS_REQUEST":
      return {
        ...state,
        loadingReports: true
      };
    case "AJAX_PROJECT_REPORTS_SUCCESS":
      return {
        ...state,
        loadingReports: false,
        reports: action.payload
      };
    case "AJAX_PROJECT_REPORTS_FAILURE":
      return {
        ...state,
        loadingReports: false
      };
    default:
      return state;
  }
};

export default reducer;
