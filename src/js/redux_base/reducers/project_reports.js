const initialState = {
  fetchingProject: true,
  fetchingReports: true,
  project: false,
  reports: false,
  isAddTagInput: false,
  suggestedTags: []
};

const reducer = (state = initialState, action) => {
  let p, project;
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
    case "STOP_FETCHING_PROJECT_REPORTS":
    case "AJAX_GET_PROJECT_REPORTS_FAILURE":
      return {
        ...state,
        fetchingReports: false
      };
    case "AJAX_POST_DASHBOARD_ADD_MEMBER_SUCCESS":
      p = action.payload.projects[0];
      project = { ...state.project, members: p.members };
      return { ...state, project };
    case "AJAX_DASHBOARD_REMOVE_MEMBER_SUCCESS":
      p = action.property;
      project = { ...state.project, members: p.members };
      return { ...state, project };
    case "AJAX_DASHBOARD_UPDATE_MEMBER_SUCCESS":
      const { members } = action.data;
      project = { ...state.project, members };
      return { ...state, project };
    case "AJAX_GET_SEARCH_PROJECT_TAGS_SUCCESS": {
      const { tags } = action.payload;
      return { ...state, suggestedTags: tags };
    }
    case "AJAX_POST_CREATE_TAG_SUCCESS": {
      const { custom_tags } = action.payload;
      project = { ...state.project, custom_tags };
      return { ...state, project, isAddTagInput: false };
    }
    case "AJAX_POST_REMOVE_TAG_FROM_PROJECT_SUCCESS": {
      const { custom_tags } = action.payload;
      project = { ...state.project, custom_tags };
      return { ...state, project };
    }
    case "SHOW_TAG_INPUT_ON_PROJECT": {
      return { ...state, isAddTagInput: true };
    }
    case "HIDE_TAG_INPUT_ON_PROJECT": {
      return { ...state, isAddTagInput: false };
    }
    default:
      return state;
  }
};

export default reducer;
