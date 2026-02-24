import { useRef, useState } from "react";

function useZipManagerState({ apiFilesystem, root }) {
  const [zipFilesystem, setZipFilesystem] = useState(apiFilesystem);
  const [selectedFolder, setSelectedFolder] = useState(root);
  const [entries, setEntries] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [navigation, setNavigation] = useState({
    previousHighlight: null,
    direction: 0
  });
  const [downloads, setDownloads] = useState({ queue: [], nextId: 0 });
  const [clipboardData, setClipboardData] = useState(null);
  const [history, setHistory] = useState({
    path: [root],
    index: 0
  });
  const [entriesHeight, setEntriesHeight] = useState(1);
  const [entriesElementHeight, setEntriesElementHeight] = useState(0);
  const [entriesDeltaHeight, setEntriesDeltaHeight] = useState(0);
  const [dialogs, setDialogs] = useState({});
  const [clickedButtonName, setClickedButtonName] = useState(null);
  const [theme, setTheme] = useState({});
  const [musicData, setMusicData] = useState({
    frequencyData: []
  });
  const [playerActive, setPlayerActive] = useState(false);

  const highlightedEntryElementRef = useRef(null);
  const entriesElementRef = useRef(null);

  const getHighlightedEntryElement = () => highlightedEntryElementRef.current;
  const resetHighlightedEntryElement = () => highlightedEntryElementRef.current = null;

  return {
    zipFilesystem,
    setZipFilesystem,
    selectedFolder,
    setSelectedFolder,
    entries,
    setEntries,
    highlightedIds,
    setHighlightedIds,
    navigation,
    setNavigation,
    downloads,
    setDownloads,
    clipboardData,
    setClipboardData,
    history,
    setHistory,
    entriesHeight,
    setEntriesHeight,
    entriesElementHeight,
    setEntriesElementHeight,
    entriesDeltaHeight,
    setEntriesDeltaHeight,
    dialogs,
    setDialogs,
    clickedButtonName,
    setClickedButtonName,
    theme,
    setTheme,
    musicData,
    setMusicData,
    playerActive,
    setPlayerActive,
    highlightedEntryElementRef,
    entriesElementRef,
    getHighlightedEntryElement,
    resetHighlightedEntryElement
  };
}

export default useZipManagerState;
