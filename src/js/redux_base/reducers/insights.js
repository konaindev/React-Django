const initialState = {
  baselineInsights: [],
  baselineInsightsLoaded: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "RESET_INSIGHTS_STATE":
      return initialState;
    case "AJAX_GET_BASELINE_INSIGHTS_SUCCESS":
      const baselineInsights = action.payload.baseline_insights;
      return {
        ...state,
        baselineInsights,
        baselineInsightsLoaded: true
      };
    case "AJAX_GET_BASELINE_INSIGHTS_FAILURE":
      return {
        ...state,
        baselineInsights: initialState.baselineInsights,
        baselineInsightsLoaded: true
      };
    default:
      return state;
  }
};

export default reducer;
