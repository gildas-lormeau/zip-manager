import "./styles/OptionsDialog.css";
import Dialog from "./Dialog.jsx";

import { useRef, useState } from "react";
import { constants } from "../../business";

const OPTION_NAMES = [
  "zoomFactor",
  "hideNavigationBar",
  "hideDownloadManager",
  "hideInfobar",
  "skin",
  "promptForExportPassword",
  "defaultExportPassword",
  "keepOrder",
  "checkSignature",
  "bufferedWrite",
  "maxWorkers",
  "chunkSize"
];
const EMPTY_VALUES = {
  zoomFactor: "",
  hideNavigationBar: false,
  hideDownloadManager: false,
  hideInfobar: false,
  skin: constants.OPTIONS_DEFAULT_SKIN,
  promptForExportPassword: false,
  defaultExportPassword: "",
  keepOrder: false,
  checkSignature: false,
  bufferedWrite: false,
  maxWorkers: "0",
  chunkSize: "0"
};

function getValues(data) {
  const values = Object.fromEntries(
    OPTION_NAMES.map((name) => [name, data[name]])
  );
  values.chunkSize = data.chunkSize / 1024;
  return values;
}

function OptionsDialog({
  data,
  onSetOptions,
  onResetOptions,
  onClose,
  messages
}) {
  const [values, setValues] = useState(() =>
    data ? getValues(data) : EMPTY_VALUES
  );
  const [prevData, setPrevData] = useState(data);
  const defaultPasswordInputRef = useRef(null);

  if (data !== prevData) {
    setPrevData(data);
    if (data) {
      setValues(getValues(data));
    }
  }

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setValues((values) => ({
      ...values,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleFocusDefaultExportPassword() {
    defaultPasswordInputRef.current.select();
  }

  function handleSubmit() {
    onSetOptions({
      ...values,
      zoomFactor: Number(values.zoomFactor),
      maxWorkers: Number(values.maxWorkers),
      chunkSize: Number(values.chunkSize) * 1024
    });
  }

  return (
    <Dialog
      className="options-dialog"
      data={data}
      title={messages.OPTIONS_TITLE}
      onSubmit={handleSubmit}
      onReset={onResetOptions}
      onClose={onClose}
      resetLabel={messages.DIALOG_RESET_BUTTON_LABEL}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.OPTIONS_DIALOG_BUTTON_LABEL}
    >
      <label>
        <span>{messages.OPTIONS_ZOOM_FACTOR_LABEL}</span>
        <input
          name="zoomFactor"
          value={values.zoomFactor}
          type="number"
          required
          min={20}
          max={500}
          step={5}
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_HIDE_NAVIGATION_BAR_LABEL}</span>
        <input
          name="hideNavigationBar"
          checked={values.hideNavigationBar}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_HIDE_DOWNLOAD_MANAGER_LABEL}</span>
        <input
          name="hideDownloadManager"
          checked={values.hideDownloadManager}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_HIDE_INFOBAR_LABEL}</span>
        <input
          name="hideInfobar"
          checked={values.hideInfobar}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_SELECT_SKIN_LABEL}</span>
        <select name="skin" value={values.skin} onChange={handleChange}>
          <option value={constants.OPTIONS_DEFAULT_SKIN}>
            {messages.OPTIONS_DEFAULT_SKIN_LABEL}
          </option>
          <option value={constants.OPTIONS_DOS_SKIN}>
            {messages.OPTIONS_DOS_SKIN_LABEL}
          </option>
        </select>
      </label>
      <label>
        <span>{messages.OPTIONS_EXPORT_ZIP_PASSWORD_LABEL}</span>
        <input
          name="promptForExportPassword"
          checked={values.promptForExportPassword}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_DEFAULT_PASSWORD_LABEL}</span>
        <input
          name="defaultExportPassword"
          type="password"
          autoComplete="off"
          value={values.defaultExportPassword}
          onFocus={handleFocusDefaultExportPassword}
          onChange={handleChange}
          ref={defaultPasswordInputRef}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_CHECK_SIGNATURE_LABEL}</span>
        <input
          name="checkSignature"
          checked={values.checkSignature}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_BUFFERED_WRITE_LABEL}</span>
        <input
          name="bufferedWrite"
          checked={values.bufferedWrite}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_MAX_WORKERS_LABEL}</span>
        <input
          name="maxWorkers"
          value={values.maxWorkers}
          type="number"
          required
          disabled={!values.bufferedWrite}
          min={1}
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_KEEP_ORDER_LABEL}</span>
        <input
          name="keepOrder"
          checked={values.keepOrder}
          type="checkbox"
          onChange={handleChange}
        />
      </label>
      <label>
        <span>{messages.OPTIONS_CHUNK_SIZE_LABEL}</span>
        <input
          name="chunkSize"
          value={values.chunkSize}
          type="number"
          required
          min={1}
          onChange={handleChange}
        />
      </label>
    </Dialog>
  );
}

export default OptionsDialog;
