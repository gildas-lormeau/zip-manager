/* global TransformStream, Response */

function getCommonFeatures({
  setDownloadId,
  setDownloads,
  setErrorMessageDialog,
  removeDownload,
  downloaderElement,
  downloadService,
  filesystemService
}) {


  async function saveEntries(entries, filename, options, parentHandle) {
    if (filesystemService.savePickersSupported()) {
      try {
        if (!parentHandle && (entries.length > 1 || entries[0].directory)) {
          parentHandle = await getParentHandle();
        }
      } catch (error) {
        if (downloadService.downloadAborted(error)) {
          return;
        } else {
          throw error;
        }
      }
    }
    await Promise.all(
      entries.map(async (entry) =>
        saveEntry(entry, filename, options, parentHandle)
      )
    );
  }

  async function saveEntry(entry, filename, options, parentHandle) {
    if (!parentHandle && entry.directory) {
      parentHandle = await getParentHandle();
    }
    const name = filename || entry.name;
    let download;
    try {
      if (entry.directory) {
        await saveDirectoryEntry(name, entry, options, parentHandle);
      } else {
        download = {
          name,
          controller: downloadService.createAbortController(),
          progressValue: null,
          progressMax: null
        };
        await saveFileEntry(name, entry, options, download, parentHandle);
      }
    } catch (error) {
      if (!downloadService.downloadAborted(error)) {
        throw error;
      }
    } finally {
      if (download) {
        removeDownload(download);
      }
    }
  }

  async function saveDirectoryEntry(name, entry, options, parentHandle) {
    const directoryHandle = await parentHandle.getDirectoryHandle(name, {
      create: true
    });
    await saveEntries(entry.children, null, options, directoryHandle);
  }

  async function saveFileEntry(name, entry, options, download, parentHandle) {
    const { signal } = download.controller;
    const onprogress = (progressValue, progressMax) =>
      onDownloadProgress(download.id, progressValue, progressMax);
    let fileHandle, writable, blob;
    if (filesystemService.savePickersSupported()) {
      if (parentHandle) {
        fileHandle = await parentHandle.getFileHandle(name, {
          create: true
        });
      } else {
        fileHandle = await getFileHandle(name);
        download.name = fileHandle.name;
      }
      writable = await fileHandle.createWritable();
    } else {
      ({ writable, blob } = getWritableBlob());
    }
    setDownloadId((downloadId) => {
      download.id = downloadId + 1;
      return download.id;
    });
    setDownloads((downloads) => [download, ...downloads]);
    await entry.getWritable(writable, { signal, onprogress, ...options });
    if (!filesystemService.savePickersSupported() && !signal.aborted) {
      downloadService.downloadBlob(
        await blob,
        downloaderElement,
        download.name
      );
    }
  }

  function getWritableBlob() {
    const { readable, writable } = new TransformStream({});
    const blob = new Response(readable).blob();
    return {
      blob,
      writable
    };
  }

  function getParentHandle() {
    return filesystemService.showDirectoryPicker({
      mode: "readwrite",
      startIn: "downloads"
    });
  }

  function getFileHandle(suggestedName) {
    return filesystemService.showSaveFilePicker({
      suggestedName,
      mode: "readwrite",
      startIn: "downloads"
    });
  }

  function onDownloadProgress(downloadId, progressValue, progressMax) {
    setDownloads((downloads) =>
      downloads.map((download) => {
        if (download.id === downloadId) {
          download = {
            ...download,
            progressValue,
            progressMax
          };
        }
        return download;
      })
    );
  }

  function openDisplayError(message) {
    setErrorMessageDialog({
      message
    });
  }

  function closeDisplayError() {
    setErrorMessageDialog(null);
  }

  return {
    saveEntry,
    saveEntries,
    openDisplayError,
    closeDisplayError
  };
}

export default getCommonFeatures;
