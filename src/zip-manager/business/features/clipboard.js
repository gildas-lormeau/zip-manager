function getClipboardHandlers({ setClipboardData }) {
  function resetClipboardData() {
    setClipboardData(null);
  }

  return {
    resetClipboardData
  };
}

export { getClipboardHandlers };
