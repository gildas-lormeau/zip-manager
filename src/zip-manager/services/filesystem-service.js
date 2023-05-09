/* global window */

const FILESYSTEM_FILE_KIND = "file";
const FILESYSTEM_DIRECTORY_KIND = "directory";
const ABORT_ERROR_NAME = "AbortError";

async function showOpenFilePicker({ multiple, description, accept } = {}) {
  const excludeAcceptAllOption = Boolean(accept);
  try {
    const options = {
      excludeAcceptAllOption,
      multiple
    };
    if (excludeAcceptAllOption) {
      Object.assign(options, {
        types: [
          {
            description,
            accept
          }
        ]
      });
    }
    const fileHandles = await window.showOpenFilePicker(options);
    return Promise.all(fileHandles.map((fileHandle) => fileHandle.getFile()));
  } catch (error) {
    if (error.name === ABORT_ERROR_NAME) {
      return [];
    } else {
      throw error;
    }
  }
}

function openFilePickerSupported() {
  return "showOpenFilePicker" in window;
}

function showDirectoryPicker(options) {
  return window.showDirectoryPicker(options);
}

function showSaveFilePicker(options) {
  return window.showSaveFilePicker(options);
}

function savePickersSupported() {
  return "showSaveFilePicker" in window && "showDirectoryPicker" in window;
}

export {
  FILESYSTEM_FILE_KIND,
  FILESYSTEM_DIRECTORY_KIND,
  openFilePickerSupported,
  showOpenFilePicker,
  showDirectoryPicker,
  savePickersSupported,
  showSaveFilePicker
};
