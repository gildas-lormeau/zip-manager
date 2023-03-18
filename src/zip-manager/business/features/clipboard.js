function getClipboardFeatures({ setClipboardData }) {
  function resetClipboardData() {
    setClipboardData(null);
  }

  return {
    resetClipboardData
  };
}

export default getClipboardFeatures;
