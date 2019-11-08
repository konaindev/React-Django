const initialState = {
  fetchingProject: true,
  fetchingReports: true,
  project: false,
  reports: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "AJAX_GET_PROJECT_OVERALL_REQUEST":
      return initialState;
    case "AJAX_GET_PROJECT_OVERALL_SUCCESS":
      return {
        ...state,
        fetchingProject: false,
        project: action.payload
      };
    case "AJAX_GET_PROJECT_OVERALL_FAILURE":
      return {
        ...state,
        fetchingProject: false
      };
    case "AJAX_GET_PROJECT_REPORTS_REQUEST":
      return {
        ...state,
        fetchingReports: true
      };
    case "AJAX_GET_PROJECT_REPORTS_SUCCESS":
      return {
        ...state,
        fetchingReports: false,
        reports: action.payload
      };
    case "AJAX_GET_PROJECT_REPORTS_FAILURE":
      return {
        ...state,
        fetchingReports: false
      };
    default:
      return state;
  }
};

export default reducer;
