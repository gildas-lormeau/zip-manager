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

function getFilesystemHandles(items) {
  return Promise.all(
    Array.from(items)
      .filter((item) => item.kind === FILESYSTEM_FILE_KIND)
      .map((item) => {
        if ("getAsFileSystemHandle" in item) {
          return item.getAsFileSystemHandle();
        } else {
          const entry = item.webkitGetAsEntry();
          return transformToFileSystemhandle(entry);
        }
      })
  );
}

async function transformToFileSystemhandle(entry) {
  const handle = {
    name: entry.name
  };
  if (entry.isFile) {
    handle.kind = FILESYSTEM_FILE_KIND;
    handle.getFile = () =>
      new Promise((resolve, reject) => entry.file(resolve, reject));
  }
  if (entry.isDirectory) {
    handle.kind = FILESYSTEM_DIRECTORY_KIND;
    const handles = await transformToFileSystemhandles(entry);
    handle.values = () => handles;
  }
  return handle;
}

async function transformToFileSystemhandles(entry) {
  const entries = [];
  function readEntries(directoryReader, resolve, reject) {
    directoryReader.readEntries(async (entriesPart) => {
      if (!entriesPart.length) {
        resolve(entries);
      } else {
        for (const entry of entriesPart) {
          entries.push(await transformToFileSystemhandle(entry));
        }
        readEntries(directoryReader, resolve, reject);
      }
    }, reject);
  }
  await new Promise((resolve, reject) =>
    readEntries(entry.createReader(), resolve, reject)
  );
  return {
    [Symbol.iterator]() {
      let entryIndex = 0;
      return {
        next() {
          const result = {
            value: entries[entryIndex],
            done: entryIndex === entries.length
          };
          entryIndex++;
          return result;
        }
      };
    }
  };
}

export {
  FILESYSTEM_FILE_KIND,
  FILESYSTEM_DIRECTORY_KIND,
  openFilePickerSupported,
  showOpenFilePicker,
  showDirectoryPicker,
  savePickersSupported,
  showSaveFilePicker,
  getFilesystemHandles
};
