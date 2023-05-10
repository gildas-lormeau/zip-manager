/* global window, document */

const FILESYSTEM_FILE_KIND = "file";
const ABORT_ERROR_NAME = "AbortError";

async function showOpenFilePicker({ multiple, description, accept } = {}) {
  const excludeAcceptAllOption = Boolean(accept);
  if ("showOpenFilePicker" in window) {
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
  } else {
    const fileInputElement = document.createElement("input");
    Object.assign(fileInputElement, {
      type: "file",
      accept,
      multiple
    });
    return new Promise((resolve) => {
      fileInputElement.onchange = ({ target }) => {
        if (target.files.length) {
          resolve(Array.from(target.files));
        }
      };
      fileInputElement.click();
    });
  }
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
  showOpenFilePicker,
  showDirectoryPicker,
  savePickersSupported,
  showSaveFilePicker
};
