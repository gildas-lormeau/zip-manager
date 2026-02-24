import { useMemo } from "react";

import { getUIState } from "../business/index.js";
import { filesystemService } from "../services/index.js";

function useZipManagerUIState({
  entries,
  highlightedIds,
  selectedFolder,
  clipboardData,
  history,
  dialogs,
  getOptions
}) {
  return useMemo(() => getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    history,
    getOptions,
    dialogs,
    filesystemService
  }), [
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    history,
    dialogs,
    getOptions
  ]);
}

export default useZipManagerUIState;
