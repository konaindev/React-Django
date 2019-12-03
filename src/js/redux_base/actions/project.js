import { createAjaxAction, URLS } from "./helpers";

const actions = {
  removeTag: projectId =>
    createAjaxAction(
      "AJAX_POST_REMOVE_TAG_FROM_PROJECT",
      `${URLS.project}/${projectId}/remove-tag`
    )
};

export default actions;
