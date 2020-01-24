const initialState = {
  performanceInsights: [],
  performanceInsightsLoaded: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "AJAX_GET_PERFORMANCE_INSIGHTS_SUCCESS":
      const performanceInsights = action.payload.performance_insights;
      return {
        ...state,
        performanceInsights,
        performanceInsightsLoaded: true
      };
    case "AJAX_GET_PERFORMANCE_INSIGHTS_FAILURE":
      return {
        ...state,
        performanceInsights: initialState.performanceInsights,
        performanceInsightsLoaded: true
      };
    default:
      return state;
  }
};

export default reducer;
