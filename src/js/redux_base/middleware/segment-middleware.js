/**
 *
 * trackedActionMap
 *
 * this is an object whose keys are also
 * redux action types. this object will be
 * used to associate an action with a category
 * via the `belongsTo` key. if a `func` key is
 * supplied and is a function, it will be invoked
 * with the redux action and store as the only
 * arguments. this function should return an
 * object that will be sent to segment when the
 * action is tracked.
 *
 */
const trackedActionMap = {
  AJAX_DASHBOARD_REMOVE_MEMBER: {
    belongsTo: "invite_modal"
  },
  AJAX_DASHBOARD_REMOVE_MEMBER: {
    belongsTo: "invite_modal"
  },
  INVITE_MODAL_REMOVE_MODAL_HIDE: {
    belongsTo: "invite_modal"
  },
  INVITE_MODAL_REMOVE_MODAL_SHOW: {
    belongsTo: "invite_modal"
  },
  API_INVITE_MODAL_CHANGE_ROLE: {
    belongsTo: "invite_modal",
    func: (action, store) => ({ reduxAction: action.type })
  },
  AJAX_GET_PROJECT_REPORTS_REQUEST: {
    belongsTo: "project_detail"
  }
};

export const sendToSegment = store => next => action => {
  const keys = Object.keys(trackedActionMap);
  if (keys.includes(action.type)) {
    let body = {};
    if (trackedActionMap[action.type]?.func === "function") {
      body = trackedActionMap[action.type].func(action, store);
    }
    body.reduxAction = action.type;
    window.analytics.track(trackedActionMap[action.type].belongsTo, body);
  }
  // we always pass the action on
  next(action);
};

export default sendToSegment;
