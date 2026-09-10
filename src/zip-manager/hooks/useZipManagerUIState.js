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
  return getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    history,
    getOptions,
    dialogs,
    filesystemService
  });
}

export default useZipManagerUIState;
