function getCommonFeatures({
  dialogs,
  setDownloads,
  setDialogs,
  removeDownload,
  downloadService,
  filesystemService,
  environmentService
}) {
  const isMacOSPlatform = environmentService.isMacOSPlatform();

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
        saveFile(entry, filename, options, parentHandle)
      )
    );
  }

  async function saveFile(entry, filename, options, parentHandle) {
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
    setDownloads((downloads) => {
      let { nextId } = downloads;
      download.id = nextId;
      nextId = nextId + 1;
      return {
        nextId,
        queue: [download, ...downloads.queue]
      };
    });
    await entry.getWritable(writable, { signal, onprogress, ...options });
    if (!filesystemService.savePickersSupported() && !signal.aborted) {
      filesystemService.saveBlob(await blob, download.name);
    }
  }

  function getWritableBlob() {
    // eslint-disable-next-line no-undef
    const { readable, writable } = new TransformStream({});
    // eslint-disable-next-line no-undef
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
    setDownloads((downloads) => ({
      ...downloads,
      queue: downloads.queue.map((download) => {
        if (download.id === downloadId) {
          download = {
            ...download,
            progressValue,
            progressMax
          };
        }
        return download;
      })
    }));
  }

  function openDisplayError(message) {
    setDialogs({
      ...dialogs,
      displayError: { message }
    });
  }

  function closeDisplayError() {
    setDialogs({
      ...dialogs,
      displayError: null
    });
  }

  function modifierKeyPressed(event) {
    return isMacOSPlatform ? event.metaKey : event.ctrlKey;
  }

  return {
    modifierKeyPressed,
    saveZipFile: saveFile,
    saveEntries,
    openDisplayError,
    closeDisplayError
  };
}

export default getCommonFeatures;
