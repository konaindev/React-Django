import { qsStringify } from "../../utils/misc";
import { createAjaxAction, URLS } from "./helpers";

const actions = {
  createTag: projectId =>
    createAjaxAction(
      "AJAX_POST_CREATE_TAG",
      `${URLS.project}/${projectId}/create-tag/`
    ),
  removeTag: projectId =>
    createAjaxAction(
      "AJAX_POST_REMOVE_TAG_FROM_PROJECT",
      `${URLS.project}/${projectId}/remove-tag/`
    ),
  fetchSuggestedTags: projectId =>
    createAjaxAction(
      "AJAX_GET_SUGGESTION_TAGS",
      `${URLS.project}/${projectId}/suggested-tags/`,
      qs => qsStringify(qs)
    ),
  showAddTagInput: () => ({ type: "SHOW_TAG_INPUT_ON_PROJECT" })
};

export default actions;
