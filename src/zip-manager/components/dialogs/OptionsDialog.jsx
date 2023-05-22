import "./styles/OptionsDialog.css";
import Dialog from "./Dialog.jsx";

import { useEffect, useRef, useState } from "react";
import { constants } from "../../business";

function OptionsDialog({
  data,
  onSetOptions,
  onResetOptions,
  onClose,
  messages
}) {
  const [zoomFactor, setZoomFactor] = useState("");
  const [hideNavigationBar, setHideNavigationBar] = useState(false);
  const [hideDownloadManager, setHideDownloadManager] = useState(false);
  const [hideInfobar, setHideInfobar] = useState(false);
  const [skin, setSkin] = useState("default");
  const [defaultExportPassword, setDefaultExportPassword] = useState("");
  const [promptForExportPassword, setPromptForExportPassword] = useState(false);
  const [keepOrder, setKeepOrder] = useState(false);
  const [checkSignature, setCheckSignature] = useState(false);
  const [bufferedWrite, setBufferedWrite] = useState(false);
  const [maxWorkers, setMaxWorkers] = useState("0");
  const [chunkSize, setChunkSize] = useState("0");
  const defaultPasswordInputRef = useRef(null);

  function handleChangeZoomFactor(event) {
    setZoomFactor(event.target.value);
  }

  function handleChangeHideNavigationBar(event) {
    setHideNavigationBar(event.target.checked);
  }

  function handleChangeHideDownloadManager(event) {
    setHideDownloadManager(event.target.checked);
  }

  function handleChangeHideInfobar(event) {
    setHideInfobar(event.target.checked);
  }

  function handleChangeSkin(event) {
    setSkin(event.target.value);
  }

  function handleChangePromptForExportPassword(event) {
    setPromptForExportPassword(event.target.checked);
  }

  function handleFocusDefaultExportPassword() {
    defaultPasswordInputRef.current.select();
  }

  function handleChangeDefaultExportPassword(event) {
    setDefaultExportPassword(event.target.value);
  }

  function handleChangeKeepOrder(event) {
    setKeepOrder(event.target.checked);
  }

  function handleChangeBufferedWrite(event) {
    setBufferedWrite(event.target.checked);
  }

  function handleChangeCheckSignature(event) {
    setCheckSignature(event.target.checked);
  }

  function handleChangeMaxWorkers(event) {
    setMaxWorkers(event.target.value);
  }

  function handleChangeChunkSize(event) {
    setChunkSize(event.target.value);
  }

  function handleSubmit() {
    onSetOptions({
      zoomFactor: Number(zoomFactor),
      hideNavigationBar,
      hideDownloadManager,
      hideInfobar,
      skin,
      promptForExportPassword,
      defaultExportPassword,
      keepOrder,
      checkSignature,
      bufferedWrite,
      maxWorkers: Number(maxWorkers),
      chunkSize: Number(chunkSize) * 1024
    });
  }

  function updateData() {
    if (data) {
      const {
        zoomFactor,
        hideNavigationBar,
        hideDownloadManager,
        hideInfobar,
        skin,
        promptForExportPassword,
        defaultExportPassword,
        keepOrder,
        checkSignature,
        bufferedWrite,
        maxWorkers,
        chunkSize
      } = data;
      setZoomFactor(zoomFactor);
      setHideNavigationBar(hideNavigationBar);
      setHideDownloadManager(hideDownloadManager);
      setHideInfobar(hideInfobar);
      setSkin(skin);
      setPromptForExportPassword(promptForExportPassword);
      setDefaultExportPassword(defaultExportPassword);
      setKeepOrder(keepOrder);
      setCheckSignature(checkSignature);
      setBufferedWrite(bufferedWrite);
      setMaxWorkers(maxWorkers);
      setChunkSize(chunkSize / 1024);
    }
  }

  useEffect(updateData, [data]);
  return (
    <Dialog
      className="options-dialog"
      data={data}
      title={messages.OPTIONS_TITLE}
      onOpen={updateData}
      onSubmit={handleSubmit}
      onReset={onResetOptions}
      onClose={onClose}
      resetLabel={messages.DIALOG_RESET_BUTTON_LABEL}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.OPTIONS_DIALOG_BUTTON_LABEL}
    >
      <label>
        {messages.OPTIONS_ZOOM_FACTOR_LABEL}
        <input
          value={zoomFactor}
          type="number"
          required
          min={20}
          max={500}
          step={5}
          onChange={handleChangeZoomFactor}
        />
      </label>
      <label>
        {messages.OPTIONS_HIDE_NAVIGATION_BAR_LABEL}
        <input
          checked={hideNavigationBar}
          type="checkbox"
          onChange={handleChangeHideNavigationBar}
        />
      </label>
      <label>
        {messages.OPTIONS_HIDE_DOWNLOAD_MANAGER_LABEL}
        <input
          checked={hideDownloadManager}
          type="checkbox"
          onChange={handleChangeHideDownloadManager}
        />
      </label>
      <label>
        {messages.OPTIONS_HIDE_INFOBAR_LABEL}
        <input
          checked={hideInfobar}
          type="checkbox"
          onChange={handleChangeHideInfobar}
        />
      </label>
      <label>
        {messages.OPTIONS_SELECT_SKIN_LABEL}
        <select value={skin} onChange={handleChangeSkin}>
          <option value={constants.OPTIONS_DEFAULT_SKIN}>
            {messages.OPTIONS_DEFAULT_SKIN_LABEL}
          </option>
          <option value={constants.OPTIONS_DOS_SKIN}>
            {messages.OPTIONS_DOS_SKIN_LABEL}
          </option>
        </select>
      </label>
      <label>
        {messages.OPTIONS_EXPORT_ZIP_PASSWORD_LABEL}
        <input
          checked={promptForExportPassword}
          type="checkbox"
          onChange={handleChangePromptForExportPassword}
        />
      </label>
      <label>
        {messages.OPTIONS_DEFAULT_PASSWORD_LABEL}
        <input
          type="password"
          autoComplete="off"
          value={defaultExportPassword}
          onFocus={handleFocusDefaultExportPassword}
          onChange={handleChangeDefaultExportPassword}
          ref={defaultPasswordInputRef}
        />
      </label>
      <label>
        {messages.OPTIONS_CHECK_SIGNATURE_LABEL}
        <input
          checked={checkSignature}
          type="checkbox"
          onChange={handleChangeCheckSignature}
        />
      </label>
      <label>
        {messages.OPTIONS_BUFFERED_WRITE_LABEL}
        <input
          checked={bufferedWrite}
          type="checkbox"
          onChange={handleChangeBufferedWrite}
        />
      </label>
      <label>
        {messages.OPTIONS_MAX_WORKERS_LABEL}
        <input
          value={maxWorkers}
          type="number"
          required
          disabled={!bufferedWrite}
          min={1}
          onChange={handleChangeMaxWorkers}
        />
      </label>
      <label>
        {messages.OPTIONS_KEEP_ORDER_LABEL}
        <input
          checked={keepOrder}
          type="checkbox"
          onChange={handleChangeKeepOrder}
        />
      </label>
      <label>
        {messages.OPTIONS_CHUNK_SIZE_LABEL}
        <input
          value={chunkSize}
          type="number"
          required
          min={1}
          onChange={handleChangeChunkSize}
        />
      </label>
    </Dialog>
  );
}

export default OptionsDialog;
