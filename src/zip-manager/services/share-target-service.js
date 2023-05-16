/* global fetch, location, history */

import {
  SHARED_FILES_PARAMETER,
  SHARED_FILES_RELATIVE_PATH,
  SHARED_FILES_FIELD_NAME
} from "./share-target-service-constants.js";

async function onShareFiles(callback) {
  const locationSearch = getLocationSearch();
  if (locationSearch) {
    resetLocationSearch();
    if (locationSearch === SHARED_FILES_PARAMETER) {
      const sharedFilesPath = SHARED_FILES_RELATIVE_PATH;
      const response = await fetch(sharedFilesPath);
      const formData = await response.formData();
      callback(formData.getAll(SHARED_FILES_FIELD_NAME));
    }
  }
}

function getLocationSearch() {
  return location.search;
}

function resetLocationSearch() {
  return history.replaceState(null, null, location.pathname);
}

export { onShareFiles };
